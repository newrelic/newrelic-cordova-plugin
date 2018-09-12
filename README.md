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

# Contributing Code

We welcome code contributions (in the form of pull requests) from our user community. Before submitting a pull request please review [these guidelines](CONTRIBUTING.md).

Following these helps us efficiently review and incorporate your contribution and avoid breaking your code with future changes to the agent.

# License

Copyright (c) 2017 New Relic. All rights reserved.
For New Relic agent license details see:
* https://docs.newrelic.com/docs/licenses/ios-agent-licenses
* https://docs.newrelic.com/docs/licenses/android-agent-licenses
