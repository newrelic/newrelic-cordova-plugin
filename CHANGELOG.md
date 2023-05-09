# Changelog

# 6.1.0

## New in this release

* Upgraded to native iOS agent 7.4.3
* Upgraded to native Android agent 6.10.0

## Fixed in this release

* Fixed issue to handle null errors given by Cordova's event listener.
* Fixed issue where large cyclical structures printed to console would cause out-of-memory issues on Android.
* Fixed issue where plugin would fail to load on iOS devices with Safari 14.1 or lower.

# 6.0.2

## Fixed in this release

* Fixed issue where attributes were not reporting correctly for custom events and breadcrumbs.

----
# 6.0.1
## New in this release

* Added hot and cold app launch time. You can find more information here: [Android](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/install-configure/configure-app-launch-time-android-apps) and [iOS](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-ios/configuration/app-launch-times-ios-apps)


## Fixed in this release

* Updated to Android Agent 6.9.2

---

# 6.0.0
## New in this release
* Capture JavaScript errors
* Generate distributed traces
* Track promise rejection (an unhandled exception in JavaScript)
* Track warnings and errors with console logs
* Capture interactions and their sequences
* Track user sessions
