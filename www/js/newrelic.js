/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

var exec = require("cordova/exec");

var NewRelic = {

    /**
     * 
     * @param {string} url The URL of the request.
     * @param {string} method The HTTP method used, such as GET or POST.
     * @param {number} status The statusCode of the HTTP response, such as 200 for OK.
     * @param {number} startTime The start time of the request in milliseconds since the epoch.
     * @param {number} endTime The end time of the request in milliseconds since the epoch.
     * @param {number} bytesSent The number of bytes sent in the request.
     * @param {number} bytesReceived The number of bytes received in the response.
     * @param {string} body Optional. The response body of the HTTP response. The response body will be truncated and included in an HTTP Error metric if the HTTP transaction is an error.
     */
    noticeHttpTransaction: function (url, method, status, startTime, endTime, bytesSent, bytesReceived, body, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "noticeHttpTransaction", [url, method, status, startTime, endTime, bytesSent, bytesReceived, body]);
    },

    noticeDistributedTrace: function (cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "noticeDistributedTrace");
    },

    /**
     * Sets a custom user identifier value to associate mobile user
     * @param {string} userId The user identifier string.
     */
    setUserId: function (userId, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setUserId", [userId]);
    },

    /**
     * Creates a custom attribute with a specified name and value.
     * When called, it overwrites its previous value and type.
     * The created attribute is shared by multiple Mobile event types.
     * @param {string} name Name of the attribute.
     * @param {number} value Value of the attribute.
     */
    setAttribute: function (name, value, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setAttribute", [name, value]);
    },

    /**
     * Remove a custom attribute with a specified name and value.
     * When called, it removes the attribute specified by the name string.
     * The removed attribute is shared by multiple Mobile event types.
     * @param {string} name Name of the attribute. 
     */
    removeAttribute: function (name, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "removeAttribute", [name, value]);
    },

    /**
     * Creates and records a MobileBreadcrumb event.
     * @param {string} name The name you want to give to a breadcrumb event.
     * @param {Map<string, string|number>} eventAttributes A map that includes a list of attributes.
     */
    recordBreadcrumb: function (name, eventAttributes, cb, fail) {
        if (eventAttributes === undefined) {
            eventAttributes = {}
        }
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordBreadCrumb", [name, eventAttributes]);
    },

    /**
     * Creates and records a custom event, for use in New Relic Insights.
     * The event includes a list of attributes, specified as a map.
     * @param {string} eventType The type of event.
     * @param {string} eventName The name of the event.
     * @param {Map<string, string|number>} attributes A map that includes a list of attributes.
     */
    recordCustomEvent: function (eventType, eventName, attributes, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordCustomEvent", [eventType, eventName, attributes]);
    },

    /**
     * Track a method as an interaction.
     * @param {string} actionName The name of the action.
     * @param {function} cb A success callback function.
     * @returns {Promise} A promise containing the interactionId.
     */
    startInteraction: function (actionName, cb, fail) {
        return new Promise(function (cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "startInteraction", [actionName]);
        });
    },

    /**
     * End an interaction
     * @param {string} interactionId The string ID for the interaction you want to end. This string is returned when you use startInteraction().
     */
    endInteraction: function (interactionId, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "endInteraction", [interactionId]);
    },

    sendConsole(type, args) {
        const argsStr = JSON.stringify(args);
        this.send('MobileJSConsole', { consoleType: type, args: argsStr });
    },

    send(name, args) {
        const nameStr = String(name);
        const argsStr = {};
        Object.keys(args).forEach(key => {
            argsStr[String(key)] = String(args[key]);
        });

        this.recordCustomEvent("consoleEvents", name, args);
    },

    /**
     * Records JavaScript errors for cordova.
     * @param {string} name The name of the error.
     * @param {string} message The message of the error.
     * @param {string} stack The error stack of the error.
     * @param {boolean} isFatal The flag for whether the error is fatal.
     */
    recordError(name, message, stack, isFatal, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordError", [name, message, stack, isFatal]);
    },

    /**
     * Throws a demo run-time exception to test New Relic crash reporting.
     * @param {string} message An optional argument attached to the exception.
     */
    crashNow: function (message = '', cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "crashNow", [message]);
    },

    /**
     * Returns the current session ID as a parameter to the successful callback function.
     * This method is useful for consolidating monitoring of app data (not just New Relic data) based on a single session definition and identifier.
     * @param {function} cb A success callback function.
     * @returns {Promise} A promise containing the current session ID.
     */
    currentSessionId: function (cb, fail) {
        return new Promise(function (cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "currentSessionId");
        });
    },

    /**
     * Increments the count of an attribute with a specified name.
     * When called, it overwrites its previous value and type each time.
     * If attribute does not exist, it creates an attribute with a value of 1.
     * The incremented attribute is shared by multiple Mobile event types.
     * @param {string} name The name of the attribute.
     * @param {number} value Optional argument that increments the attribute by this value.
     */
    incrementAttribute: function (name, value = 1, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "incrementAttribute", [name, value]);
    },

    /**
     * Records network failures.
     * If a network request fails, use this method to record details about the failure.
     * In most cases, place this call inside exception handlers.
     * @param {string} url The URL of the request.
     * @param {string} httpMethod The HTTP method used, such as GET or POST.
     * @param {number} startTime The start time of the request in milliseconds since the epoch.
     * @param {number} endTime The end time of the request in milliseconds since the epoch.
     * @param {string} failure The name of the network failure. Possible values are 'Unknown', 'BadURL', 'TimedOut', 'CannotConnectToHost', 'DNSLookupFailed', 'BadServerResponse', 'SecureConnectionFailed'.
     */
    noticeNetworkFailure: function (url, httpMethod, startTime, endTime, failure, cb, fail) {
        const failureNames = new Set(['Unknown', 'BadURL', 'TimedOut', 'CannotConnectToHost', 'DNSLookupFailed', 'BadServerResponse', 'SecureConnectionFailed']);
        if (!failureNames.has(failure)) {
            window.console.error("NewRelic.noticeNetworkFailure: Network failure name has to be one of: 'Unknown', 'BadURL', 'TimedOut', 'CannotConnectToHost', 'DNSLookupFailed', 'BadServerResponse', 'SecureConnectionFailed'");
            return;
        }
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "noticeNetworkFailure", [url, httpMethod, startTime, endTime, failure]);
    },

    /**
     * 
     * @param {string} name The name for the custom metric.
     * @param {string} category The metric category name.
     * @param {number} value Optional. The value of the metric. Value should be a non-zero positive number.
     * @param {string} countUnit Optional (but requires value and valueUnit to be set). Unit of measurement for the metric count. Supported values are 'PERCENT', 'BYTES', 'SECONDS', 'BYTES_PER_SECOND', or 'OPERATIONS'.
     * @param {string} valueUnit Optional (but requires value and countUnit to be set). Unit of measurement for the metric value. Supported values are 'PERCENT', 'BYTES', 'SECONDS', 'BYTES_PER_SECOND', or 'OPERATIONS'. 
     */
    recordMetric: function (name, category, value = -1, countUnit = null, valueUnit = null, cb, fail) {
        const metricUnits = new Set(['PERCENT', 'BYTES', 'SECONDS', 'BYTES_PER_SECOND', 'OPERATIONS']);
        if (value < 0) {
            if (countUnit !== null || valueUnit !== null) {
                window.console.error('NewRelic.recordMetric: value must be set in recordMetric if countUnit and valueUnit are set');
                return;
            }
        } else {
            if ((countUnit !== null && valueUnit == null) || (countUnit == null && valueUnit !== null)) {
                window.console.error('NewRelic.recordMetric: countUnit and valueUnit in recordMetric must both be null or set');
                return;
            } else if (countUnit !== null && valueUnit !== null) {
                if (!metricUnits.has(countUnit) || !metricUnits.has(valueUnit)) {
                    window.console.error("NewRelic.recordMetric: countUnit or valueUnit in recordMetric has to be one of 'PERCENT', 'BYTES', 'SECONDS', 'BYTES_PER_SECOND', 'OPERATIONS'");
                    return;
                }
            }
        }
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordMetric", [name, category, value, countUnit, valueUnit]);
    },

    /**
     * Removes all attributes from the session..
     */
    removeAllAttributes: function (cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "removeAllAttributes");
    },

    /**
     * Sets the event harvest cycle length.
     * Default is 600 seconds (10 minutes).
     * Minimum value cannot be less than 60 seconds.
     * Maximum value should not be greater than 600 seconds.
     * @param {number} maxBufferTimeInSeconds The maximum time (in seconds) that the agent should store events in memory.
     */
    setMaxEventBufferTime: function (maxBufferTimeInSeconds, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setMaxEventBufferTime", [maxBufferTimeInSeconds]);
    },

    /**
     * Sets the maximum size of the event pool stored in memory until the next harvest cycle.
     * When the pool size limit is reached, the agent will start sampling events, discarding some new and old, until the pool of events is sent in the next harvest cycle.
     * Default is a maximum of 1000 events per event harvest cycle.
     * @param {number} maxPoolSize The maximum number of events per harvest cycle.
     */
    setMaxEventPoolSize: function (maxPoolSize, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setMaxEventPoolSize", [maxPoolSize]);
    },

    /**
     * FOR ANDROID ONLY.
     * Enable or disable collection of event data.
     * @param {boolean} enabled Boolean value for enabling analytics events.
     */
    analyticsEventEnabled: function (enabled, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "analyticsEventEnabled", [enabled]);
    },

    /**
     * Enable or disable reporting sucessful HTTP request to the MobileRequest event type.
     * @param {boolean} enabled Boolean value for enable successful HTTP requests.
     */
    networkRequestEnabled: function (enabled, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "networkRequestEnabled", [enabled]);
    },

    /**
     * Enable or disable reporting network and HTTP request errors to the MobileRequestError event type.
     * @param {boolean} enabled Boolean value for enabling network request errors.
     */
    networkErrorRequestEnabled: function (enabled, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "networkErrorRequestEnabled", [enabled]);
    },

    /**
     * Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
     * @param {boolean} enabled Boolean value for enabling HTTP response bodies. 
     */
    httpRequestBodyCaptureEnabled: function (enabled, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "httpRequestBodyCaptureEnabled", [enabled]);
    },

}

networkRequest = {};
var originalXhrOpen = XMLHttpRequest.prototype.open;
var originalXHRSend = XMLHttpRequest.prototype.send;
window.XMLHttpRequest.prototype.open = function (method, url) {
    // Keep track of the method and url
    // start time is tracked by the `send` method

    // eslint-disable-next-line prefer-rest-params

    networkRequest.url = url;
    networkRequest.method = method;
    networkRequest.bytesSent = 0;
    networkRequest.startTime = Date.now();
    return originalXhrOpen.apply(this, arguments)

}




window.XMLHttpRequest.prototype.send = function (data) {

    console.log(data);

    if (this.addEventListener) {
        this.addEventListener(
            'readystatechange', async () => {

                if (this.readyState === this.HEADERS_RECEIVED) {
                    const contentTypeString = this.getResponseHeader('Content-Type');


                    if (this.getAllResponseHeaders()) {
                        const responseHeaders = this.getAllResponseHeaders().split('\r\n');
                        const responseHeadersDictionary = {};
                        responseHeaders.forEach(element => {
                            const key = element.split(':')[0];
                            const value = element.split(':')[1];
                            responseHeadersDictionary[key] = value;
                        });

                    }
                }
                if (this.readyState === this.DONE) {
                    networkRequest.endTime = Date.now();
                    networkRequest.status = this.status;
                    networkRequest.bytesreceived = this.responseText.length;
                    networkRequest.body = this.responseText;


                    NewRelic.noticeHttpTransaction(networkRequest.url, networkRequest.method, networkRequest.status, networkRequest.startTime, networkRequest.endTime, networkRequest.bytesSent, networkRequest.bytesreceived, networkRequest.body);



                }
            },
            false
        );

    }
    console.log(Date.now());
    return originalXHRSend.apply(this, arguments);
}

window.addEventListener("error", (event) => {
    console.log(event);
    if (cordova.platformId == "android") {
        NewRelic.recordError(event.message, event.error.message, event.error.stack, true);
    } else if (cordova.platformId == "iOS") {
        NewRelic.recordError(event.message, "", "", true);
    }
});

try {
    window.addEventListener('unhandledrejection', (e) => {
        const err = new Error(`${e.reason}`)
        NewRelic.recordError(error.name, error.message, "", true);
    })
} catch (err) {
    // do nothing -- addEventListener is not supported
}


const defaultLog = window.console.log;
const defaultWarn = window.console.warn;
const defaultError = window.console.error;

console.log = function () {
    NewRelic.sendConsole('log', arguments);
    defaultLog.apply(console, arguments);
};
console.warn = function () {
    NewRelic.sendConsole('warn', arguments);
    defaultWarn.apply(console, arguments);
};
console.error = function () {
    NewRelic.sendConsole('error', arguments);
    defaultError.apply(console, arguments);
};

module.exports = NewRelic;
