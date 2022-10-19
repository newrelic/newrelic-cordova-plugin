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
     * @param {number} bytesreceived The number of bytes received in the response.
     * @param {string} body Optional. The response body of the HTTP response. The response body will be truncated and included in an HTTP Error metric if the HTTP transaction is an error.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    noticeHttpTransaction: function (url, method, status, startTime, endTime, bytesSent, bytesreceived, body, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "noticeHttpTransaction", [url, method, status, startTime, endTime, bytesSent, bytesreceived, body]);
    },

    //
    noticeDistributedTrace: function (cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "noticeDistributedTrace");
    },
    
    /**
     * Sets a custom user identifier value to associate mobile user
     * @param {string} userId The user identifier string.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
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
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    setAttribute: function (name, value, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setAttribute", [name, value]);
    },

    /**
     * Remove a custom attribute with a specified name and value.
     * When called, it removes the attribute specified by the name string.
     * The removed attribute is shared by multiple Mobile event types.
     * @param {string} name Name of the attribute. 
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    removeAttribute: function (name, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "removeAttribute", [name, value]);
    },

    /**
     * Creates and records a MobileBreadcrumb event.
     * @param {string} name The name you want to give to a breadcrumb event.
     * @param {Map<string, string|number>} eventAttributes A map that includes a list of attributes.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
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
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    recordCustomEvent: function (eventType, eventName, attributes, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordCustomEvent", [eventType, eventName, attributes]);
    },

    /**
     * Track a method as an interaction.
     * @param {string} actionName The name of the action.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     * @returns 
     */
    startInteraction: function (actionName, cb, fail) {
        return new Promise(function(cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "startInteraction", [actionName]);
        });
    },

    /**
     * End an interaction
     * @param {string} interactionId The string ID for the interaction you want to end. This string is returned when you use startInteraction().
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
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
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    recordError(name, message, stack, isFatal, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordError", [name, message, stack, isFatal]);
    },

    /**
     * Throws a demo run-time exception to test New Relic crash reporting.
     * @param {string} message An optional argument attached to the exception.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    crashNow: function(message='', cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "crashNow", [message]);
    },

    /**
     * Returns the current session ID as a parameter to the successful callback function.
     * This method is useful for consolidating monitoring of app data (not just New Relic data) based on a single session definition and identifier.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    currentSessionId: function(cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "currentSessionId");
    },

    /**
     * Increments the count of an attribute with a specified name.
     * When called, it overwrites its previous value and type each time.
     * If attribute does not exist, it creates an attribute with a value of 1.
     * The incremented attribute is shared by multiple Mobile event types.
     * @param {string} name The name of the attribute.
     * @param {number} value Optional argument that increments the attribute by this value.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    incrementAttribute: function(name, value=1, cb, fail) {
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
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    noticeNetworkFailure: function(url, httpMethod, startTime, endTime, failure, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "noticeNetworkFailure", [url, httpMethod, startTime, endTime, failure]);
    },

    /**
     * 
     * @param {string} name The name for the custom metric.
     * @param {string} category The metric category name.
     * @param {number} value Optional. The value of the metric. Value should be a non-zero positive number.
     * @param {string} countUnit Optional (but requires value and valueUnit to be set). Unit of measurement for the metric count. Supported values are 'PERCENT', 'BYTES', 'SECONDS', 'BYTES_PER_SECOND', or 'OPERATIONS'.
     * @param {string} valueUnit Optional (but requires value and countUnit to be set). Unit of measurement for the metric value. Supported values are 'PERCENT', 'BYTES', 'SECONDS', 'BYTES_PER_SECOND', or 'OPERATIONS'. 
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    recordMetric: function(name, category, value=-1, countUnit=null, valueUnit=null, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordMetric", [name, category, value, countUnit, valueUnit]);
    },

    /**
     * Removes all attributes from the session.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    removeAllAttributes: function(cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "removeAllAttributes");
    },

    /**
     * Sets the event harvest cycle length.
     * Default is 600 seconds (10 minutes).
     * Minimum value cannot be less than 60 seconds.
     * Maximum value should not be greater than 600 seconds.
     * @param {number} maxBufferTimeInSeconds The maximum time (in seconds) that the agent should store events in memory.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    setMaxEventBufferTime: function(maxBufferTimeInSeconds, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setMaxEventBufferTime", [maxBufferTimeInSeconds]);
    },

    /**
     * Sets the maximum size of the event pool stored in memory until the next harvest cycle.
     * When the pool size limit is reached, the agent will start sampling events, discarding some new and old, until the pool of events is sent in the next harvest cycle.
     * Default is a maximum of 1000 events per event harvest cycle.
     * @param {number} maxPoolSize The maximum number of events per harvest cycle.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    setMaxEventPoolSize: function(maxPoolSize, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setMaxEventPoolSize", [maxPoolSize]);
    },

    /**
     * FOR ANDROID ONLY.
     * Enable or disable collection of event data.
     * @param {boolean} enabled Boolean value for enabling analytics events.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    analyticsEventEnabled: function(enabled, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "analyticsEventEnabled", [enabled]);
    },

    /**
     * Enable or disable reporting sucessful HTTP request to the MobileRequest event type.
     * @param {boolean} enabled Boolean value for enable successful HTTP requests.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    networkRequestEnabled: function(enabled, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "networkRequestEnabled", [enabled]);
    },

    /**
     * Enable or disable reporting network and HTTP request errors to the MobileRequestError event type.
     * @param {boolean} enabled Boolean value for enabling network request errors.
     * @param {function} cb A success callback function.
     * @param {function} fail An error callback function.
     */
    networkErrorRequestEnabled: function(enabled, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "networkErrorRequestEnabled", [enabled]);
    },

    /**
     * Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
     * @param {boolean} enabled Boolean value for enabling HTTP response bodies. 
     */
    httpRequestBodyCaptureEnabled: function(enabled, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "httpRequestBodyCaptureEnabled", [enabled]);
    },

}

networkRequest = {};
window.XMLHttpRequest.prototype.open = function (method, url) {
    // Keep track of the method and url
    // start time is tracked by the `send` method

    // eslint-disable-next-line prefer-rest-params
    console.log("nis" + method);
    console.log(url);
    networkRequest.url = url;
    networkRequest.method = method;
    networkRequest.bytesSent = 0;
    networkRequest.startTime = Date.now();
    return originalXhrOpen.apply(this, arguments)

}

window.XMLHttpRequest.prototype.setRequestHeader = function (string, value) {

    console.log("string" + string);
    console.log("value" + value);
    return originalXHRSsetRequestHeaders.apply(this, arguments);


}


window.XMLHttpRequest.prototype.send = function (data) {

    console.log(data);

    if (this.addEventListener) {
        this.addEventListener(
            'readystatechange', async () => {

                if (this.readyState === this.HEADERS_RECEIVED) {
                    const contentTypeString = this.getResponseHeader('Content-Type');
                    if (contentTypeString) {
                        console.log("1" + contentTypeString);
                    }

                    if (this.getAllResponseHeaders()) {
                        const responseHeaders = this.getAllResponseHeaders().split('\r\n');
                        const responseHeadersDictionary = {};
                        responseHeaders.forEach(element => {
                            const key = element.split(':')[0];
                            const value = element.split(':')[1];
                            responseHeadersDictionary[key] = value;
                        });
                        console.log("2" + responseHeadersDictionary);
                    }
                }
                if (this.readyState === this.DONE) {
                    console.log("3" + this.status);
                    networkRequest.endTime = Date.now();
                    networkRequest.status = this.status;
                    networkRequest.bytesreceived = this.responseText.length;
                    networkRequest.body = this.responseText;

                    if (this.response) {
                        if (this.responseType === 'blob') {
                            var responseText = await (new Response(this.response)).text();
                            console.log("3" + responseText);


                        } else if (this.responseType === 'text') {
                            console.log("3" + this.response);
                        }

                        NewRelic.noticeHttpTransaction(networkRequest.url, networkRequest.method, networkRequest.status, networkRequest.startTime, networkRequest.endTime, networkRequest.bytesSent, networkRequest.bytesreceived, networkRequest.body);

                    }

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

console.log = function() {
  NewRelic.sendConsole('log', arguments);
  defaultLog.apply(console, arguments);
};
console.warn = function() {
  NewRelic.sendConsole('warn', arguments);
  defaultWarn.apply(console, arguments);
};
console.error = function() {
  NewRelic.sendConsole('error', arguments);
  defaultError.apply(console, arguments);
};

module.exports = NewRelic;
