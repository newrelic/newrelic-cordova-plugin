//  New Relic for Mobile -- Android edition
//
//  See:
//    https://docs.newrelic.com/docs/releases/android for release notes
//
//  Copyright (c) 2021 New Relic. All rights reserved.
//  See https://docs.newrelic.com/docs/licenses/android-agent-licenses for license details
//

package com.newrelic.cordova.plugin;

import android.util.Log;

import com.newrelic.agent.android.Agent;
import com.newrelic.agent.android.NewRelic;
import com.newrelic.agent.android.harvest.DeviceInformation;
import com.newrelic.agent.android.logging.AgentLog;
import com.newrelic.agent.android.Agent;
import com.newrelic.agent.android.ApplicationFramework;
import com.newrelic.agent.android.analytics.AnalyticsAttribute;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

public class NewRelicCordovaPlugin extends CordovaPlugin {
    private final static String TAG = NewRelicCordovaPlugin.class.getSimpleName();

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

            devInfo.setApplicationFramework(ApplicationFramework.Cordova);
            devInfo.setApplicationFrameworkVersion(pluginVersion);
            NewRelic.setAttribute(AnalyticsAttribute.APPLICATION_PLATFORM_VERSION_ATTRIBUTE, pluginVersion);             
        }

    }

}
