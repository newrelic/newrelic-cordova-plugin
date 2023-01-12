/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

package com.newrelic.cordova.plugin;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.newrelic.agent.android.Agent;
import com.newrelic.agent.android.ApplicationFramework;
import com.newrelic.agent.android.NewRelic;
import com.newrelic.agent.android.analytics.AnalyticsAttribute;
import com.newrelic.agent.android.distributedtracing.TraceContext;
import com.newrelic.agent.android.distributedtracing.TraceHeader;
import com.newrelic.agent.android.harvest.DeviceInformation;
import com.newrelic.agent.android.stats.StatsEngine;
import com.newrelic.agent.android.metric.MetricUnit;
import com.newrelic.agent.android.util.NetworkFailure;
import com.newrelic.agent.android.FeatureFlag;
import com.newrelic.com.google.gson.Gson;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;


public class NewRelicCordovaPlugin extends CordovaPlugin {
    private final static String TAG = NewRelicCordovaPlugin.class.getSimpleName();

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        String appToken = preferences.getString("ANDROID_APP_TOKEN", null);

        if (appToken == null || appToken.isEmpty() || "x".equals(appToken)) {
            Log.e(TAG, "Failed to load application token! The Android agent is not configured for Cordova.");

        } else {

            final String pluginVersion = preferences.getString("PLUGIN_VERSION", "undefined");
            final DeviceInformation devInfo = Agent.getDeviceInformation();

            NewRelic.withApplicationToken(appToken)
                    .withApplicationFramework(ApplicationFramework.Cordova, pluginVersion)
                    .withLoggingEnabled(true)
                    .start(this.cordova.getActivity().getApplication());

            NewRelic.setAttribute(AnalyticsAttribute.APPLICATION_PLATFORM_VERSION_ATTRIBUTE, pluginVersion);
        }

    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        try {

            switch (action) {
                case "recordBreadCrumb": {
                    final String breadcrumb = args.getString(0);
                    final JSONObject attributesASJson = args.getJSONObject(1);
                    final Map<String, Object> attributes = new Gson().fromJson(String.valueOf(attributesASJson),
                            Map.class);
                    if (attributes != null) {
                        NewRelic.recordBreadcrumb(breadcrumb, attributes);
                    } else {
                        NewRelic.recordBreadcrumb(breadcrumb);
                    }
                    break;
                }
                case "setUserId":
                    final String userId = args.getString(0);
                    NewRelic.setUserId(userId);
                    break;
                case "startInteraction":
                    final String actionName = args.getString(0);
                    callbackContext.success(NewRelic.startInteraction(actionName));
                    break;
                case "endInteraction":
                    final String interactionId = args.getString(0);
                    NewRelic.endInteraction(interactionId);
                    break;
                case "recordCustomEvent": {
                    final String eventType = args.getString(0);
                    final String eventName = args.getString(1);
                    final JSONObject attributesASJson = args.getJSONObject(2);
                    final Map<String, Object> attributes = new Gson().fromJson(String.valueOf(attributesASJson),
                            Map.class);

                    NewRelic.recordCustomEvent(eventType, eventName, attributes);

                    break;
                }
                case "setAttribute": {
                    final String name = args.getString(0);
                    final Object value = args.get(1);
                    if (value instanceof Double) {
                        NewRelic.setAttribute(name, (Double) value);
                    } else if (value instanceof Boolean) {
                        NewRelic.setAttribute(name, (Boolean) value);
                    } else if (value instanceof String) {
                        NewRelic.setAttribute(name, (String) value);
                    }
                    break;
                }
                case "removeAttribute": {
                    final String name = args.getString(0);
                    NewRelic.removeAttribute(name);
                    break;
                }
                case "recordError": {
                    final String errorName = args.getString(0);
                    final String errorMessage = args.getString(1);
                    final String errorStack = args.getString(2);
                    final Boolean isFatal = args.getBoolean(3);

                    try {

                        Map<String, Object> crashEvents = new HashMap<>();
                        crashEvents.put("Name", errorName);
                        crashEvents.put("Message", errorMessage);
                        crashEvents.put("isFatal", isFatal);
                        if (errorStack != null) {
                            // attribute limit is 4096
                            crashEvents.put("errorStack",
                                    errorStack.length() > 4095 ? errorStack.substring(0, 4094) : errorStack);
                        }

                        NewRelic.recordBreadcrumb("JS Errors", crashEvents);
                        NewRelic.recordCustomEvent("JS Errors", "", crashEvents);

                        StatsEngine.get().inc("Supportability/Mobile/Cordova/JSError");

                    } catch (IllegalArgumentException e) {
                        Log.w("NRMA", e.getMessage());
                    }

                    break;
                }
                case "noticeHttpTransaction": {
                    final String url = args.getString(0);
                    final String method = args.getString(1);
                    final int status = args.getInt(2);
                    final int startTime = args.getInt(3);
                    final int endTime = args.getInt(4);
                    final int bytesSent = args.getInt(5);
                    final int bytesReceived = args.getInt(6);
                    final String body = args.getString(7);

                    NewRelic.noticeHttpTransaction(url, method, status, startTime, endTime, bytesSent, bytesReceived,
                            body);
                    break;
                }
                case "noticeDistributedTrace": {

                    cordova.getThreadPool().execute(new Runnable() {
                        public void run() {
                            try {
                                TraceContext traceContext = NewRelic.noticeDistributedTrace(null);

                                Map<String, Object> traceAttributes = new HashMap<>(traceContext.asTraceAttributes());
                                for (TraceHeader header : traceContext.getHeaders()) {
                                    traceAttributes.put(header.getHeaderName(), header.getHeaderValue());
                                }

                                callbackContext.success(new JSONObject(traceAttributes));

                            } catch (Exception e) {
                                NewRelic.recordHandledException(e);
                            }
                        }
                    });

                    break;
                }
                case "crashNow": {
                    Handler mainHandler = new Handler(Looper.getMainLooper());

                    Runnable myRunnable = new Runnable() {
                        @Override
                        public void run() {
                            String message = null;
                            try {
                                message = args.getString(0);
                            } catch (Exception e) {
                                NewRelic.recordHandledException(e);
                            }
                            if (message == null || message.isEmpty()) {
                                NewRelic.crashNow();
                            } else {
                                NewRelic.crashNow(message);
                            }
                        }
                    };
                    mainHandler.post(myRunnable);
                    break;
                }
                case "currentSessionId": {
                    String sessionId = NewRelic.currentSessionId();
                    callbackContext.success(sessionId);
                    break;
                }
                case "incrementAttribute": {
                    final String name = args.getString(0);
                    final double value = args.getDouble(1);
                    NewRelic.incrementAttribute(name, value);
                    break;
                }
                case "noticeNetworkFailure": {
                    final String url = args.getString(0);
                    final String httpMethod = args.getString(1);
                    final long startTime = args.getLong(2);
                    final long endTime = args.getLong(3);
                    final String failure = args.getString(4);

                    Map<String, NetworkFailure> strToNetworkFailure = new HashMap<>();
                    strToNetworkFailure.put("Unknown", NetworkFailure.Unknown);
                    strToNetworkFailure.put("BadURL", NetworkFailure.BadURL);
                    strToNetworkFailure.put("TimedOut", NetworkFailure.TimedOut);
                    strToNetworkFailure.put("CannotConnectToHost", NetworkFailure.CannotConnectToHost);
                    strToNetworkFailure.put("DNSLookupFailed", NetworkFailure.DNSLookupFailed);
                    strToNetworkFailure.put("BadServerResponse", NetworkFailure.BadServerResponse);
                    strToNetworkFailure.put("SecureConnectionFailed", NetworkFailure.SecureConnectionFailed);

                    NewRelic.noticeNetworkFailure(url, httpMethod, startTime, endTime, strToNetworkFailure.get(failure));
                    break;
                }
                case "recordMetric": {
                    final String name = args.getString(0);
                    final String category = args.getString(1);
                    final double value = args.getDouble(2);
                    final String metricUnit = args.getString(3);
                    final String valueUnit = args.getString(4);

                    Map<String, MetricUnit> strToMetricUnit = new HashMap<>();
                    strToMetricUnit.put("PERCENT", MetricUnit.PERCENT);
                    strToMetricUnit.put("BYTES", MetricUnit.BYTES);
                    strToMetricUnit.put("SECONDS", MetricUnit.SECONDS);
                    strToMetricUnit.put("BYTES_PER_SECOND", MetricUnit.BYTES_PER_SECOND);
                    strToMetricUnit.put("OPERATIONS", MetricUnit.OPERATIONS);

                    if (value < 0) {
                        NewRelic.recordMetric(name, category);
                    } else {
                        if (metricUnit == null || valueUnit == null || metricUnit.equals("null") || valueUnit.equals("null")) {
                            NewRelic.recordMetric(name, category, value);
                        } else {
                            NewRelic.recordMetric(name, category, 1, value, value, strToMetricUnit.get(metricUnit), strToMetricUnit.get(valueUnit));
                        }
                    }

                    break;
                }
                case "removeAllAttributes": {
                    NewRelic.removeAllAttributes();
                    break;
                }
                case "setMaxEventBufferTime": {
                    final int maxEventBufferTimeInSeconds = args.getInt(0);
                    NewRelic.setMaxEventBufferTime(maxEventBufferTimeInSeconds);
                    break;
                }
                case "setMaxEventPoolSize": {
                    final int maxPoolSize = args.getInt(0);
                    NewRelic.setMaxEventPoolSize(maxPoolSize);
                    break;
                }
                case "analyticsEventEnabled": {
                    final boolean enabled = args.getBoolean(0);
                    if(enabled) {
                        NewRelic.enableFeature(FeatureFlag.AnalyticsEvents);
                    } else {
                        NewRelic.disableFeature(FeatureFlag.AnalyticsEvents);
                    }
                    break;
                }
                case "networkRequestEnabled": {
                    final boolean enabled = args.getBoolean(0);
                    if(enabled) {
                        NewRelic.enableFeature(FeatureFlag.NetworkRequests);
                    } else {
                        NewRelic.disableFeature(FeatureFlag.NetworkRequests);
                    }
                    break;
                }
                case "networkErrorRequestEnabled": {
                    final boolean enabled = args.getBoolean(0);
                    if(enabled) {
                        NewRelic.enableFeature(FeatureFlag.NetworkErrorRequests);
                    } else {
                        NewRelic.disableFeature(FeatureFlag.NetworkErrorRequests);
                    }
                    break;
                }
                case "httpRequestBodyCaptureEnabled": {
                    final boolean enabled = args.getBoolean(0);
                    if(enabled) {
                        NewRelic.enableFeature(FeatureFlag.HttpResponseBodyCapture);
                    } else {
                        NewRelic.disableFeature(FeatureFlag.HttpResponseBodyCapture);
                    }
                    break;
                }
                
            }
        } catch (Exception e) {
            NewRelic.recordHandledException(e);
            return false;
        }

        return true;

    }

}
