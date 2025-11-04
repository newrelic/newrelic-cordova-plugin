# Changelog
# 1.0.1

- Native Android agent updated to version 7.6.11
- Native iOS agent updated to version 7.6.0




# 7.0.9

- Native Android agent updated to version 7.6.8
- Native iOS agent updated to version 7.5.8


# 7.0.8

- Native Android agent updated to version 7.6.6
- Native iOS agent updated to version 7.5.5


# 7.0.7

- Native Android agent updated to version 7.6.5

# 7.0.6

- Native iOS agent updated to version 7.5.4

# 7.0.5

## Improvements

- Implemented Distributed Tracing support for `XMLHttpRequest`.
- Updated the Native Android agent to version 7.6.4.


# 7.0.4

## Improvements

- Native Android agent updated to version 7.6.2
- Native iOS agent updated to version 7.5.3


# 7.0.3

## Improvements

- Native Android agent updated to version 7.6.1
- Native iOS agent updated to version 7.5.2

# 7.0.2

## Bug Fixes
Fixed an issue with the getHttpHeaderforTracking function, which was causing problems with fetch instrumentation. This fix ensures proper tracking of HTTP requests.

## Updates
Updated the underlying native Android agent to version 7.6.0. This update brings improved performance, stability, and compatibility with the latest Android environments.



# 7.0.1

## New Features and Improvements

Added a console log disable flag to optionally turn off console log instrumentation. This addresses loading issues some customers were experiencing with certain JavaScript files.

## Improvements

- Native Android agent updated to version 7.5.1
- Native iOS agent updated to version 7.5.1

# 7.0.0

## New Features

1. Application Exit Information
    - Added ApplicationExitInfo to data reporting
    - Enabled by default

2. Log Forwarding to New Relic
    - Implement static API for sending logs to New Relic
    - Can be enabled/disabled in your mobile application's entity settings page
   
## Improvements

- Native Android agent updated to version 7.5.0
- Native iOS agent updated to version 7.5.0

# 6.2.10

* Improvements

The native iOS Agent has been updated to version 7.4.12, bringing performance enhancements and bug fixes.

* New Features

A new backgroundReportingEnabled feature flag has been introduced to enable background reporting functionality.
A new newEventSystemEnabled feature flag has been added to enable the new event system.


# 6.2.9
* A crash issue in the iOS app has been resolved when the Cordova agent receives responses in the form of blobs or array buffers.
* The native iOS agent has been updated to version 7.4.11, which brings performance enhancements and bug fixes.
* Similarly, the native Android agent has been upgraded to version 7.3.1, improving stability and introducing new features.


# 6.2.8
* 
* Updated native iOS Agent: We've upgraded the native iOS agent to version 7.4.10, which includes performance improvements and bug fixes.


# 6.2.7

### New in this release
In this release, we are introducing several new features and updates:

* Added Offline Harvesting Feature: This new feature enables the preservation of harvest data that would otherwise be lost when the application lacks an internet connection. The stored harvests will be sent once the internet connection is re-established and the next harvest upload is successful.
* Introduced setMaxOfflineStorageSize API: This new API allows the user to determine the maximum volume of data that can be stored locally. This aids in better management and control of local data storage.
* Updated native iOS Agent: We've upgraded the native iOS agent to version 7.4.9, which includes performance improvements and bug fixes.
* Updated native Android Agent: We've also upgraded the native Android agent to version 7.3.0 bringing benefits like improved stability and enhanced features. 
* Resolved an issue in the fetch instrumentation where the absence of a body led to failure in recording network requests by the agent.

These enhancements help to improve overall user experience and application performance.

# 6.2.6

### New in this release
* Fixed a bug in the fetch instrumentation where customer options were inadvertently removed when no headers were specified. Now, options will be preserved even when headers are absent.
* Addressed an issue that resulted in app crashes when an invalid URL was encountered in the capacitor plugin. To mitigate this, a valid URL checker has been implemented to ensure that mobilerequest events are created only with valid URLs.


# 6.2.5

### New in this release
* fetch instrumentation for http request
* Adds configurable request header instrumentation to network events 
   The agent will now produce network event attributes for select header values if the headers are detected on the request. The header names to instrument are passed into the agent when started.
* Upgrading the native iOS agent to version 7.4.8.
* Upgrading the native Android agent to version 7.2.0.


# 6.2.4

### New in this release
* Upgraded native Android agent to v7.1.0

# 6.2.3

### New in this release
* Upgraded native iOS agent to v7.4.6


# 6.2.2

### New in this release
* Fixes the issue where the response body appears empty for HTTP requests.
* Upgraded native Android agent to v7.0.0

# 6.2.1

### New in this release
* Upgrade native iOS agent to v7.4.5
* Added agent configuration options when adding the plugin to your project.

### Fixed in this release
* Fixed an issue where certain JS errors were improperly parsed on iOS.

# 6.2.0

### New in this release
* Upgrade native Android Agent to v6.11.1
* Upgrade native iOS agent to v7.4.4
* JavaScript Errors will now be reported as handled exceptions, providing more context and stack traces in the New Relic UI.
* Added shutdown method, providing ability to shut down the agent within the current application lifecycle during runtime.

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
