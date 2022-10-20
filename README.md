# New Relic plugin for Cordova

> The official [New Relic](https://newrelic.com/mobile-monitoring) [Cordova](http://cordova.apache.org/) plugin for iOS and Android.

# When added the New Relic Cordova plugin will
* Detect the platforms added to your Cordova application and apply the most recent release of the appropriate New Relic Mobile agent ([Android ](http://docs.newrelic.com/docs/releases/android), [iOS ](http://docs.newrelic.com/docs/releases/ios))
* Add post-build scripts for uploading iOS symbolication files
* Upload Android Proguard mapping files
* Automatically instrument mobile applications built via Cordova

# Installation

### Prerequisites
1. Cordova 7.x or newer
2. Node 6.0 or newer
3. Cordova CLI tools
4. Android and iOS Cordova platforms
5. New Relic Mobile application tokens

Make sure you have fulfilled the prerequisites for adding the [Android](https://cordova.apache.org/docs/en/latest/guide/platforms/android) or [iOS](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html) platform to your Cordova project.</br>

If you don't have a New Relic account, [create a free trial](https://newrelic.com/signup?trial=mobile) and add an application from your account page. We suggest using separate applications for iOS and Android.

Finally, copy the application tokens from your New Relic applications page, and have them ready for the next step. You only need to copy the application tokens of the platforms you are building on.

### Adding the plugin
Change to your Cordova project directory and add the plugin to your project using the Cordova command line tool. The `--variable` argument is used to pass application tokens to the plugin.
```
# Install from github repository
cordova plugin add https://github.com/newrelic/newrelic-cordova-plugin.git --variable IOS_APP_TOKEN="{ios-app-token}" --variable ANDROID_APP_TOKEN="{android-app-token}"
```

# Updating the plugin
Update the New Relic Cordova plugin to the latest released version easily via the following command:
```
cordova plugin update
```

# Usage
See the examples below and for more detail see: [New Relic IOS SDK doc](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-ios/ios-sdk-api) or [Android SDK](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api).

### [noticeHttpTransaction](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/notice-http-transaction)(url: string, method: string, status: number, startTime: number, endTime: number, bytesSent: number, bytesReceived: number, body?: string)
> The New Relic Cordova plugin automatically collects HTTP transactions, but if you want to manually record HTTP transactions, use this method to do so.
  ```js
      NewRelic.noticeHttpTransaction('https://fakewebsiteurl.com', 'GET', 200, Date.now(), Date.now(), 0, 100000, 'fake request body');
  ```

### [setUserId](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/set-user-id)(userId: string): void;
> Set a custom user identifier value to associate user sessions with analytics events and attributes.
  ```js
     NewRelic.setUserId("CORDOVA12934");
  ```

### [setAttribute](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/set-attribute)(name: string, value: boolean | number | string): void;
> Creates a session-level attribute shared by multiple mobile event types. Overwrites its previous value and type each time it is called.
  ```js
     NewRelic.setAttribute('CordovaCustomAttrNumber', 37);
  ```


### [removeAttribute](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/remove-attribute)(name: string, value: boolean | number | string): void;
> This method removes the attribute specified by the name string..
  ```js
     NewRelic.removeAttribute('CordovaCustomAttrNumber');
  ```

### [incrementAttribute](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/increment-attribute)(name: string, value?: number): void;
> Increments the count of an attribute with a specified name. Overwrites its previous value and type each time it is called. If the attribute does not exists, it creates a new attribute. If no value is given, it increments the value by 1.
```js
    NewRelic.incrementAttribute('CordovaCustomAttrNumber');
    NewRelic.incrementAttribute('CordovaCustomAttrNumber', 5);
```

### [removeAllAttributes](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/remove-all-attributes)(): void;
> Removes all attributes from the session
```js
    NewRelic.removeAllAttributes();
```

### [recordBreadcrumb](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/recordbreadcrumb)(name: string, attributes?: {[key: string]: boolean | number | string}): void;
> Track app activity/screen that may be helpful for troubleshooting crashes.

  ```js
     NewRelic.recordBreadcrumb("shoe", {"shoeColor": "blue","shoesize": 9,"shoeLaces": true});
  ```

### [recordCustomEvent](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/recordcustomevent-android-sdk-api)(eventType: string, eventName?: string, attributes?: {[key: string]: boolean | number | string}): void;
> Creates and records a custom event for use in New Relic Insights.

  ```js
     NewRelic.recordCustomEvent("mobileClothes", "pants", {"pantsColor": "blue","pantssize": 32,"belt": true});
  ```

### [startInteraction](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/start-interaction)(interactionName: string, cb?: function): Promise&lt;InteractionId&gt;;
> Track a method as an interaction.

### [endInteraction](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/end-interaction)(id: InteractionId): void;
> End an interaction
> (Required). This uses the string ID for the interaction you want to end.
> This string is returned when you use startInteraction() and as a parameter to the provided callback function.

  ```js
   const badApiLoad = async () => {
     const interactionId = await NewRelic.startInteraction('StartLoadBadApiCall');
     console.log(interactionId);
     const url = 'https://cordova.apache.org/moviessssssssss.json';
     fetch(url)
       .then((response) => response.json())
       .then((responseJson) => {
         console.log(responseJson);
         NewRelic.endInteraction(interactionId);
       }) .catch((error) => {
         NewRelic.endInteraction(interactionId);
         console.error(error);
       });
  
  ```

### recordError(name: string, message: string, stack: string, isFatal: boolean): void;
> Records JavaScript errors for Cordova.
```js
    try {
      var foo = {};
      foo.bar();
    } catch(err) {
      NewRelic.recordError(err.name, err.message, err.stack, true);
    }
```

### [crashNow](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/crashnow-android-sdk-api)(message?: string): void;
> Throws a demo run-time exception to test New Relic crash reporting.

```js
    NewRelic.crashNow();
    NewRelic.crashNow("New Relic example crash message");
```

### [currentSessionId](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/currentsessionid-android-sdk-api)(): Promise&lt;sessionId&gt;;
> Returns the current session ID. This method is useful for consolidating monitoring of app data (not just New Relic data) based on a single session definition and identifier.
```js
    let sessionId = await NewRelic.currentSessionId();
```

### [noticeNetworkFailure](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/notice-network-failure)(url: string, httpMethod: string, startTime: number, endTime: number, failure: string): void;
> Records network failures. If a network request fails, use this method to record details about the failures. In most cases, place this call inside exception handlers, such as catch blocks. Supported failures are: `Unknown`, `BadURL`, `TimedOut`, `CannotConnectToHost`, `DNSLookupFailed`, `BadServerResponse`, `SecureConnectionFailed`
```js
    NewRelic.noticeNetworkFailure('https://fakewebsite.com', 'GET', Date.now(), Date.now(), 'BadURL');
```

### [recordMetric](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/recordmetric-android-sdk-api)(name: string, category: string, value?: number, countUnit?: string, valueUnit?: string): void;
> Records custom metrics (arbitrary numerical data), where countUnit is the measurement unit of the metric count and valueUnit is the measurement unit for the metric value. If using countUnit or valueUnit, then all of value, countUnit, and valueUnit must all be set. Supported measurements for countUnit and valueUnit are: `PERCENT`, `BYTES`, `SECONDS`, `BYTES_PER_SECOND`, `OPERATIONS`
```js
    NewRelic.recordMetric('CordovaCustomMetricName', 'CordovaCustomMetricCategory');
    NewRelic.recordMetric('CordovaCustomMetricName', 'CordovaCustomMetricCategory', 12);
    NewRelic.recordMetric('CordovaCustomMetricName', 'CordovaCustomMetricCategory', 13, 'PERCENT', 'SECONDS');
```

### [setMaxEventBufferTime](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/set-max-event-buffer-time)(maxBufferTimeInSeconds: number): void;
> Sets the event harvest cycle length. Default is 600 seconds (10 minutes). Minimum value can not be less than 60 seconds. Maximum value should not be greater than 600 seconds.
```js
    NewRelic.setMaxEventBufferTime(60);
```

### [setMaxEventPoolSize](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/set-max-event-pool-size)(maxSize: number): void;
> Sets the maximum size of the event pool stored in memory until the next harvest cycle. Default is a maximum of 1000 events per event harvest cycle. When the pool size limit is reached, the agent will start sampling events, discarding some new and old, until the pool of events is sent in the next harvest cycle.
```js
    NewRelic.setMaxEventPoolSize(2000);
```

### The following methods allow you to set some agent configurations *after* the agent has started:
By default, these configurations are already set to true on agent start.

### [analyticsEventEnabled](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/android-agent-configuration-feature-flags/#ff-analytics-events)(enabled: boolean) : void;
> FOR ANDROID ONLY. Enable or disable the collecton of event data.
```js
    NewRelic.analyticsEventEnabled(true);
```

### [networkRequestEnabled](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/android-agent-configuration-feature-flags/#ff-networkRequests)(enabled: boolean) : void;
> Enable or disable reporting successful HTTP requests to the MobileRequest event type.
```js
    NewRelic.networkRequestEnabled(true);
```

### [networkErrorRequestEnabled](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/android-agent-configuration-feature-flags/#ff-networkErrorRequests)(enabled: boolean) : void;
> Enable or disable reporting network and HTTP request errors to the MobileRequestError event type.
```js
    NewRelic.networkErrorRequestEnabled(true);
```

### [httpRequestBodyCaptureEnabled](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/android-agent-configuration-feature-flags/#ff-withHttpResponseBodyCaptureEnabled)(enabled: boolean) : void;
> Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
```js
    NewRelic.httpRequestBodyCaptureEnabled(true);
```

## How to see JSErrors(Fatal/Non Fatal) in NewRelic One?

There is no section for JavaScript errors, but you can see JavaScript errors in custom events and also query them in NRQL explorer.

<img width="1753" alt="Screen Shot 2022-02-10 at 12 41 11 PM" src="https://user-images.githubusercontent.com/89222514/153474861-87213e70-c3fb-4e14-aee7-a6a3fb482f73.png">

You can also build dashboard for errors using this query:

  ```sql
  SELECT jsAppVersion,name,Message,errorStack,isFatal FROM `JS Errors` SINCE 24 hours ago
  ```

# Contributing Code

We welcome code contributions (in the form of pull requests) from our user community. Before submitting a pull request please review [these guidelines](CONTRIBUTING.md).

Following these helps us efficiently review and incorporate your contribution and avoid breaking your code with future changes to the agent.

# License

Copyright (c) 2017 New Relic. All rights reserved.
For New Relic agent license details see:
* https://docs.newrelic.com/docs/licenses/ios-agent-licenses
* https://docs.newrelic.com/docs/licenses/android-agent-licenses
