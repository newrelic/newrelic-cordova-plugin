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
import com.newrelic.agent.android.logging.AgentLog;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class NewRelicCordovaPlugin extends CordovaPlugin {
    private final static String TAG = NewRelicCordovaPlugin.class.getSimpleName();
    private final Pattern chromeStackTraceRegex =
    Pattern.compile("^\\s*at (.*?) ?\\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\\/|[a-z]:\\\\|\\\\\\\\).*?)(?::(\\d+))?(?::(\\d+))?\\)?\\s*$",
      Pattern.CASE_INSENSITIVE);
    private final Pattern nodeStackTraceRegex =
    Pattern.compile("^\\s*at (?:((?:\\[object object\\])?[^\\\\/]+(?: \\[as \\S+\\])?) )?\\(?(.*?):(\\d+)(?::(\\d+))?\\)?\\s*$",
      Pattern.CASE_INSENSITIVE);

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        String appToken = preferences.getString("ANDROID_APP_TOKEN", null);

        if (isEmptyConfigParameter(appToken)) {
            Log.e(TAG, "Failed to load application token! The Android agent is not configured for Cordova.");

        } else {

            final String pluginVersion = preferences.getString("PLUGIN_VERSION", "undefined");
            final DeviceInformation devInfo = Agent.getDeviceInformation();

            if (preferences.getString("CRASH_REPORTING_ENABLED", "true").equalsIgnoreCase("false")) {
              NewRelic.disableFeature(FeatureFlag.CrashReporting);
            }
            if (preferences.getString("DISTRIBUTED_TRACING_ENABLED", "true").equalsIgnoreCase("false")) {
              NewRelic.disableFeature(FeatureFlag.DistributedTracing);
            }
            if (preferences.getString("INTERACTION_TRACING_ENABLED", "true").equalsIgnoreCase("false")) {
              NewRelic.disableFeature(FeatureFlag.InteractionTracing);
            }
            if (preferences.getString("DEFAULT_INTERACTIONS_ENABLED", "true").equalsIgnoreCase("false")) {
              NewRelic.disableFeature(FeatureFlag.DefaultInteractions);
            }

            Map<String, Integer> strToLogLevel = new HashMap<>();
            strToLogLevel.put("ERROR", AgentLog.ERROR);
            strToLogLevel.put("WARNING", AgentLog.WARN);
            strToLogLevel.put("INFO", AgentLog.INFO);
            strToLogLevel.put("VERBOSE", AgentLog.VERBOSE);
            strToLogLevel.put("AUDIT", AgentLog.AUDIT);

            int logLevel = AgentLog.INFO;
            String configLogLevel = preferences.getString("LOG_LEVEL", "INFO").toUpperCase();
            if (strToLogLevel.containsKey(configLogLevel)) {
              logLevel = strToLogLevel.get(configLogLevel);
            }

            String collectorAddress = preferences.getString("COLLECTOR_ADDRESS", null);
            String crashCollectorAddress = preferences.getString("CRASH_COLLECTOR_ADDRESS", null);

            NewRelic newRelic =  NewRelic.withApplicationToken(appToken)
              .withApplicationFramework(ApplicationFramework.Cordova, pluginVersion)
              .withLoggingEnabled(preferences.getString("LOGGING_ENABLED", "true").toLowerCase().equals("true"))
              .withLogLevel(logLevel);

            if (isEmptyConfigParameter(collectorAddress) && isEmptyConfigParameter(crashCollectorAddress)) {
              newRelic.start(this.cordova.getActivity().getApplication());
            } else {
              // Set missing collector addresses (if any)
              if (collectorAddress == null) {
                collectorAddress = "mobile-collector.newrelic.com";
              }
              if (crashCollectorAddress == null) {
                crashCollectorAddress = "mobile-crash.newrelic.com";
              }
              newRelic.usingCollectorAddress(collectorAddress);
              newRelic.usingCrashCollectorAddress(crashCollectorAddress);
              newRelic.start(this.cordova.getActivity().getApplication());
            }

            newRelic.start(this.cordova.getActivity().getApplication());

            NewRelic.setAttribute(AnalyticsAttribute.APPLICATION_PLATFORM_VERSION_ATTRIBUTE, pluginVersion);
        }
    }

    public boolean isEmptyConfigParameter(String parameter) {
        return parameter == null || parameter.isEmpty() || parameter.equals("x");
      }

    public StackTraceElement[] parseStackTrace(String stack) {
        String[] lines = stack.split("\n");
        ArrayList<StackTraceElement> stackTraceList = new ArrayList<>();
    
        for (String line : lines) {
          Matcher chromeMatcher = chromeStackTraceRegex.matcher(line);
          Matcher nodeMatcher = nodeStackTraceRegex.matcher(line);
          if (chromeMatcher.matches() || nodeMatcher.matches()) {
            Matcher matcher = chromeMatcher.matches() ? chromeMatcher : nodeMatcher;
            try {
              String method = matcher.group(1) == null ? " " : matcher.group(1);
              String file = matcher.group(2) == null ? " " : matcher.group(2);
              int lineNumber = matcher.group(3) == null ? 1 : Integer.parseInt(matcher.group(3));
              stackTraceList.add(new StackTraceElement("", method, file, lineNumber));
            } catch (Exception e) {
              NewRelic.recordHandledException(e);
              return new StackTraceElement[0];
            }
          }
        }
        return stackTraceList.toArray(new StackTraceElement[0]);
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

                    HashMap<String, Object> exceptionMap = new HashMap<>();
                    try {
                        exceptionMap.put("name", errorName);
                        exceptionMap.put("message", errorMessage);
                        exceptionMap.put("isFatal", isFatal);
                    } catch (IllegalArgumentException e) {
                        Log.w("NRMA", e.getMessage());
                    }

                    if(errorStack == null) {
                      NewRelic.recordBreadcrumb("JS Errors", exceptionMap);
                      StatsEngine.get().inc("Supportability/Mobile/Cordova/JSError");
                      break;
                    }

                    StackTraceElement[] stackTraceElements = parseStackTrace(errorStack);
                    NewRelicCordovaException exception = new NewRelicCordovaException(errorMessage, stackTraceElements);
                    exception.setStackTrace(stackTraceElements);
                    NewRelic.recordHandledException(exception, exceptionMap);

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
                case "shutdown": {
                    NewRelic.shutdown();
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
