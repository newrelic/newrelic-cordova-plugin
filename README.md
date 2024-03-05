[![Community Plus header](https://github.com/newrelic/opensource-website/raw/main/src/images/categories/Community_Plus.png)](https://opensource.newrelic.com/oss-category/#community-plus)

[![Android Testsuite](https://github.com/newrelic/newrelic-cordova-plugin/actions/workflows/android.yml/badge.svg)](https://github.com/newrelic/newrelic-cordova-plugin/actions/workflows/android.yml)
[![iOS Testsuite](https://github.com/newrelic/newrelic-cordova-plugin/actions/workflows/ios.yml/badge.svg)](https://github.com/newrelic/newrelic-cordova-plugin/actions/workflows/ios.yml)

# New Relic plugin for Cordova

> The official [New Relic](https://newrelic.com/mobile-monitoring) [Cordova](http://cordova.apache.org/) plugin for iOS and Android.

# When added the New Relic Cordova plugin will
* Detect the platforms added to your Cordova application and apply the most recent release of the appropriate New Relic Mobile agent ([Android ](http://docs.newrelic.com/docs/releases/android), [iOS ](https://docs.newrelic.com/docs/release-notes/mobile-release-notes/xcframework-release-notes/))
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

## Adding the plugin
Change to your Cordova project directory and add the plugin to your project using the Cordova command line tool. The `--variable` argument is used to pass application tokens to the plugin.
```
# Install from github repository
cordova plugin add https://github.com/newrelic/newrelic-cordova-plugin.git --variable IOS_APP_TOKEN="{ios-app-token}" --variable ANDROID_APP_TOKEN="{android-app-token}"
```

### Agent Configuration Options
***These options are only available on Cordova plugin v6.2.1 and above.***

The `--variable` argument can also be used to add optional configuration options on agent start to the plugin. 
```
# Disable Crash Reporting
cordova plugin add https://github.com/newrelic/newrelic-cordova-plugin.git --variable IOS_APP_TOKEN="{ios-app-token}" --variable ANDROID_APP_TOKEN="{android-app-token}" --variable CRASH_REPORTING_ENABLED="false"
```

Currently, the plugin supports the following agent configuration options:
* `CRASH_REPORTING_ENABLED`: Enable or disable crash reporting.
    * Possible values are `true` and `false`. Defaults to `true`.
* `DISTRIBUTED_TRACING_ENABLED`: Enable or disable the adding of distributed tracing headers to network requests.
    * Possible values are `true` and `false`. Defaults to `true`.
* `INTERACTION_TRACING_ENABLED`: Enable or disable interaction tracing. Trace instrumentation still occurs, but no traces are harvested. This will disable default and custom interactions.
    * Possible values are `true` and `false`. Defaults to `true`.
* `DEFAULT_INTERACTIONS_ENABLED`: Enable or disable default interactions. Trace instrumentation still occurs, but no traces are harvested. This will enable or disable default interactions only while custom interactions remain enabled.
    * Possible values are `true` and `false`. Defaults to `true`.
* `LOGGING_ENABLED`: Enable or disable agent logging.
    * Possible values are `true` and `false`. Defaults to `true`.
* `LOG_LEVEL`: Specifies the log level.
    * Possible values are `ERROR` (least verbose), `WARNING` `INFO`, `VERBOSE`, `DEBUG`, `AUDIT` (most verbose).
    * Defaults to `INFO` on Android and `WARNING` on iOS.
* `WEB_VIEW_INSTRUMENTATION` (iOS ONLY): Enable (default) or disable automatic WKWebView instrumentation.
    * Possible values are `true` and `false`. Defaults to `true`.
* `COLLECTOR_ADDRESS`: Specifies the URI authority component of the harvest data upload endpoint.
* `CRASH_COLLECTOR_ADDRESS`: Specifies the authority component of the crash data upload URI.
* `FEDRAMP_ENABLED`: Enable or disable reporting data using different endpoints for US government clients.
    * Possible values are `true` and `false`. Defaults to `false`.
* `CONSOLE_LOGS_ENABLED`: Enable or disable reporting javascript console logs as custom events.
    * Possible values are `true` and `false`. Defaults to `false`.
* `OFFLINE_STORAGE_ENABLED`: Enable or disable offline data storage when no internet connection is available. .
    * Possible values are `true` and `false`. Defaults to `true`.
# Updating the plugin
Update the New Relic Cordova plugin to the latest released version easily via the following command:
```
cordova plugin update
```
# Ionic Native Install

``` shell
 ionic cordova plugin add https://github.com/newrelic/newrelic-cordova-plugin.git --variable IOS_APP_TOKEN="{ios-app-token}" --variable ANDROID_APP_TOKEN="{android-app-token}"
 
 npm install @awesome-cordova-plugins/newrelic

``` 

# Usage
Our plugin uses the same APIs as our native agents. See the examples below for usage and for more detail see: [New Relic IOS SDK doc](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-ios/ios-sdk-api) or [Android SDK](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api).

### Ionic
> For those using Ionic, you can import our plugin by using awesome-cordova-plugins.
```js
  import { NewRelic } from '@awesome-cordova-plugins/newrelic';
```

### Javascript
> Methods in our plugin in Cordova can be called by importing `NewRelic` from `plugins/newrelic-cordova-plugin/www/js` or by using `window.NewRelic`.
### Typescript
> In TypeScript, you'll have to define our plugin before using it: `declare const NewRelic: any;`

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

### [setAttribute](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/set-attribute)(attributeName: string, value: boolean | number | string): void;
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

### [recordBreadcrumb](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/recordbreadcrumb)(eventName: string, attributes?: {[key: string]: boolean | number | string}): void;
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

### [setMaxOfflineStorageSize](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile/mobile-sdk/set-max-offline-storage)(megaBytes: number): void;
> Sets the maximum size of total data that can be stored for offline storage.By default, mobile monitoring can collect a maximum of 100 megaBytes of offline storage. When a data payload fails to send because the device doesn't have an internet connection, it can be stored in the file system until an internet connection has been made. After a typical harvest payload has been successfully sent, all offline data is sent to New Relic and cleared from storage.
```js
    NewRelic.setMaxOfflineStorageSize(200);
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

### [shutdown](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/shut-down/)() : void;
> Shut down the agent within the current application lifecycle during runtime.
```js
    NewRelic.shutdown();
```

### [addHTTPHeadersTrackingFor(...)](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile/mobile-sdk/add-tracked-headers/)
> This API allows you to add any header field strings to a list that gets recorded as attributes with networking request events. After header fields have been added using this function, if the headers are in a network call they will be included in networking events in NR1.
```js
  NewRelic.addHTTPHeadersTrackingFor(["Car"]);
```

### [httpRequestBodyCaptureEnabled](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api/android-agent-configuration-feature-flags/#ff-withHttpResponseBodyCaptureEnabled)(enabled: boolean) : void;
> Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
```js
    NewRelic.httpRequestBodyCaptureEnabled(true);
```

## Error Reporting
### recordError(err: [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), attributes?: {[key: string]: boolean | number | string}) : void;
Records JavaScript errors for Cordova. It is useful to add this method by adding it to the error handler of the framework that you are using. Here are some examples below:

### Angular
Angular 2+ exposes an [ErrorHandler](https://angular.io/api/core/ErrorHandler) class to handle errors. You can implement New Relic by extending this class as follows:

```ts
import { ErrorHandler, Injectable } from '@angular/core';
import { NewRelic } from "@awesome-cordova-plugins/newrelic";

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor() {
    super();
  }
  handleError(error: any): void {
    NewRelic.recordError(error);
    super.handleError(error);
  }
}
```
Then, you'll need to let Angular 2 know about this new error handler by listing overrides for the provider in `app.module.ts`:
```ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },{provide: ErrorHandler, useClass: GlobalErrorHandler}],
  bootstrap: [AppComponent],
})
```

### React
React 16+ has added error boundary components that catch errors that bubble up from child components. These are very useful for tracking errors and reporting errors to New Relic.

```js
import React, { Component } from "react";
import { NewRelic } from "@awesome-cordova-plugins/newrelic";

export class ErrorBoundary extends Component {
    componentDidCatch(error, errorInfo) {
        if (errorInfo && errorInfo.componentStack) {
            // Optional line to print out the component stack for debugging.
            console.log(errorInfo.componentStack);
        }

        NewRelic.recordError(error);
        this.setState({ error });
    }

    render() {
        // Render error messages or other components here.
    }
}
```

### Redux
You can create [Redux Middleware](https://redux.js.org/tutorials/fundamentals/part-4-store#middleware) and apply it to your store. This will allow you to report any errors to New Relic.

```js
import { NewRelic } from "@awesome-cordova-plugins/newrelic";

const NewRelicLogger = store => next => action => {
    try {
        // You can log every action as a custom event
        NewRelic.recordCustomEvent("eventType", "eventName", action);
        return next(action)
    } catch (err) { 

        // 
        NewRelic.recordBreadcrumb("NewRelicLogger error", store.getState());

        // Record the JS error to New Relic
        NewRelic.recordError(err);
    }
}

export default NewRelicLogger;
```
Make sure that the middleware is applied when creating your store:
```js
import { createStore, applyMiddleware } from "redux"
import NewRelicLogger from "./middleware/NewRelicLogger"

const store = createStore(todoApp, applyMiddleware(NewRelicLogger));
```

### Vue
Vue has a global error handler that reports native JavaScript errors and passes in the Vue instance. This handler will be useful for reporting errors to New Relic.

```js
import { NewRelic } from "@awesome-cordova-plugins/newrelic";

Vue.config.errorHandler = (err, vm, info) => {

    // Record properties passed to the component if there are any
    if(vm.$options.propsData) {
        NewRelic.recordBreadcrumb("Props passed to component", vm.$options.propsData);
    }

    // Get the lifecycle hook, if present
    let lifecycleHookInfo = 'none';
    if (info){
        lifecycleHookInfo = info;
    }

    // Record a breadcrumb with more details such as component name and lifecycle hook
    NewRelic.recordBreadcrumb("Vue Error", { 'componentName': vm.$options.name, 'lifecycleHook': lifecycleHookInfo })

    // Record the JS error to New Relic
    NewRelic.recordError(error);
}
```

### How to see JSErrors(Fatal/Non Fatal) in NewRelic One?

#### Cordova Plugin v6.2.0 and above:
JavaScript errors can be seen in the `Handled Exceptions` tab in New Relic One. You will be able to see the event trail, attributes, and stack trace for every JavaScript error recorded. 

You can also build a dashboard for these errors using this query:

```sql
SELECT * FROM MobileHandledException SINCE 24 hours ago
```

#### Cordova Plugin v6.0.0 - v6.1.0
There is no section for JavaScript errors, but you can see JavaScript errors in custom events and also query them in NRQL explorer.

<img width="1753" alt="Screen Shot 2022-02-10 at 12 41 11 PM" src="https://user-images.githubusercontent.com/89222514/153474861-87213e70-c3fb-4e14-aee7-a6a3fb482f73.png">

You can also build dashboard for errors using this query:

  ```sql
  SELECT jsAppVersion,name,Message,errorStack,isFatal FROM `JS Errors` SINCE 24 hours ago
  ```

## Uploading dSYM files

Our iOS agent includes a Swift script intended to be run from a build script in your target's build phases in XCode. The script automatically uploads dSYM files in the background (or converts your dSYM to the New Relic map file format), and then performs a background upload of the files needed for crash symbolication to New Relic.

To invoke this script during an XCode build:
1. Copy the dsym-upload-tools folder from this repository: https://github.com/newrelic/newrelic-ios-agent-spm, to your projects SRCROOT folder first. 
1. In Xcode, select your project in the navigator, then click on the application target.
1. Select the Build Phases tab in the settings editor.
1. Click the + icon above Target Dependencies and choose New Run Script Build Phase. Ensure the new build script is the very last build script.
1. Add the following lines of code to the new phase and replace `APP_TOKEN` with your iOS application token.
    1. If there is a checkbox below Run script that says "Run script: Based on Dependency analysis" please make sure it is not checked.

### Cordova Plugin 6.2.4 or higher
```
ARTIFACT_DIR="${BUILD_DIR%Build/*}"
SCRIPT=`/usr/bin/find "${SRCROOT}" "${ARTIFACT_DIR}" -type f -name run-symbol-tool | head -n 1`
/bin/sh "${SCRIPT}" "APP_TOKEN"
```
### Cordova Plugin 6.2.3 or lower
```
SCRIPT=`/usr/bin/find "${SRCROOT}" -name newrelic_postbuild.sh | head -n 1`

if [ -z "${SCRIPT}"]; then
 ARTIFACT_DIR="${BUILD_DIR%Build/*}SourcePackages/artifacts"
 SCRIPT=`/usr/bin/find "${ARTIFACT_DIR}" -name newrelic_postbuild.sh | head -n 1`
fi

/bin/sh "${SCRIPT}" "APP_TOKEN"
```

#### Note: The automatic script requires bitcode to be disabled. You should clean and rebuild your app after adding the script. 

### Missing dSYMs
The automatic script will create an `upload_dsym_results.log` file in your project's iOS directory, which contains information about any failures that occur during symbol upload.

If dSYM files are missing, you may need to check Xcode build settings to ensure the file is being generated. Frameworks which are built locally have separate build settings and may need to be updated as well.

Build settings:
```
Debug Information Format : Dwarf with dSYM File
Deployment Postprocessing: Yes
Strip Linked Product: Yes
Strip Debug Symbols During Copy : Yes
```

# Contributing Code

We welcome code contributions (in the form of pull requests) from our user community. Before submitting a pull request please review [these guidelines](CONTRIBUTING.md).

Following these helps us efficiently review and incorporate your contribution and avoid breaking your code with future changes to the agent.

# License

Copyright (c) 2017 - Present New Relic. All rights reserved.
For New Relic agent license details see:
* https://docs.newrelic.com/docs/licenses/ios-agent-licenses
* https://docs.newrelic.com/docs/licenses/android-agent-licenses
