//  New Relic for Mobile -- Android edition
//
//  See:
//    https://docs.newrelic.com/docs/releases/android for release notes
//
//  Copyright (c) 2017 New Relic. All rights reserved.
//  See https://docs.newrelic.com/docs/licenses/android-agent-licenses for license details
//

package com.newrelic.cordova.plugin;

import android.util.Log;

import com.newrelic.agent.android.Agent;
import com.newrelic.agent.android.ApplicationPlatform;
import com.newrelic.agent.android.NewRelic;
import com.newrelic.agent.android.analytics.AnalyticAttribute;
import com.newrelic.agent.android.analytics.AnalyticsControllerImpl;
import com.newrelic.agent.android.harvest.DeviceInformation;
import com.newrelic.agent.android.logging.AgentLog;
import com.newrelic.agent.android.logging.AgentLogManager;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

public class NewRelicCordovaPlugin extends CordovaPlugin {
    private static final String TAG = NewRelicCordovaPlugin.class.getSimpleName();
    private static final AgentLog log = AgentLogManager.getAgentLog();

    private static final String GET_NATIVE_DATA = "getNativeData";
    private static final String CRASH_NOW = "crashNow";

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        String appToken = preferences.getString("ANDROID_APP_TOKEN", null);

        if (appToken == null || appToken.isEmpty() || "x".equals(appToken)) {
            Log.e(TAG, "Failed to load application token! The Android agent is not configured for Cordova.");

        } else {
            NewRelic.withApplicationToken(appToken)
                    .start(this.cordova.getActivity().getApplication());

            final String pluginVersion = preferences.getString("PLUGIN_VERSION", "undefined");
            final DeviceInformation devInfo = Agent.getDeviceInformation();

            devInfo.setApplicationPlatform(ApplicationPlatform.Cordova);
            devInfo.setApplicationPlatformVersion(pluginVersion);
            AnalyticsControllerImpl.getInstance().addAttributeUnchecked(new AnalyticAttribute(AnalyticAttribute.APPLICATION_PLATFORM_ATTRIBUTE, ApplicationPlatform.Cordova.toString()), true);
            AnalyticsControllerImpl.getInstance().addAttributeUnchecked(new AnalyticAttribute(AnalyticAttribute.APPLICATION_PLATFORM_VERSION_ATTRIBUTE, pluginVersion), true);
        }
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        JSONObject r = new JSONObject();
        if (GET_NATIVE_DATA.equals(action)) {
            String uuid = getUuid();
            if (uuid.length() > 0 && !uuid.isEmpty()) {
                r.put("uuid", getUuid());
            } else {
                //if we don't have a uuid, just return the empty JSONObject
                log.error("NewRelic Mobile uuid unavailable!");
                callbackContext.error(r);
            }
            r.put("appName", getAppName());
            r.put("appVersion", getAppVersion());
            callbackContext.success(r);
        }

        if (CRASH_NOW.equals(action)) {
            JSONObject object = args.getJSONObject(0);
            if (object.has("message")) {
                String msg = object.getString("message");  
                this.crashNow(msg);    // msg could be null
            }
        }
        return true;
    }

    private String getUuid() {
        return Agent.getDeviceInformation().getDeviceId();
    }

    private String getAppName() {
        return Agent.getApplicationInformation().getAppName();
    }

    private String getAppVersion() {
        return Agent.getApplicationInformation().getAppVersion();
    }

    private void crashNow(String message) {
        NewRelic.crashNow(message);
    }
}
