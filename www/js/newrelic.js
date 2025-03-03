    /*
     * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
     * SPDX-License-Identifier: Apache-2.0
     */
    
    var exec = require("cordova/exec");

    var accountId = "";
    var applicationId = "";
    var trustAccountKey = "";
    
    
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
        noticeHttpTransaction: function (url, method, status, startTime, endTime, bytesSent, bytesReceived, body,params,traceAttributes, cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "noticeHttpTransaction", [url, method, status, startTime, endTime, bytesSent, bytesReceived, body,params,traceAttributes]);
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
         * @param {string} attributeName Name of the attribute.
         * @param {number} value Value of the attribute.
         */
        setAttribute: function (attributeName, value, cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setAttribute", [attributeName, value]);
        },
    
        /**
         * Remove a custom attribute with a specified name and value.
         * When called, it removes the attribute specified by the name string.
         * The removed attribute is shared by multiple Mobile event types.
         * @param {string} name Name of the attribute. 
         */
        removeAttribute: function (name, cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "removeAttribute", [name]);
        },
    
        /**
         * Creates and records a MobileBreadcrumb event.
         * @param {string} eventName The name you want to give to a breadcrumb event.
         * @param {Map<string, string|number>} attributes A map that includes a list of attributes.
         */
        recordBreadcrumb: function (eventName, attributes, cb, fail) {
            const crumb = new BreadCrumb({ eventName, attributes });
            crumb.attributes.isValid(() => {
                crumb.eventName.isValid(() => {
                    cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordBreadCrumb", [eventName, crumb.attributes.value]);
                });
            });
        },
    
        /**
         * Creates and records a custom event, for use in New Relic Insights.
         * The event includes a list of attributes, specified as a map.
         * @param {string} eventType The type of event.
         * @param {string} eventName The name of the event.
         * @param {Map<string, string|number>} attributes A map that includes a list of attributes.
         */
        recordCustomEvent: function (eventType, eventName, attributes, cb, fail) {
            const customEvent = new NewRelicEvent({ eventType, eventName, attributes });
            customEvent.attributes.isValid(() => {
                if (customEvent.eventName.isValid() && customEvent.eventType.isValid()) {
                    cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordCustomEvent", [eventType, eventName, customEvent.attributes.value]);
                } else {
                    window.console.error("Invalid event name or type in recordCustomEvent");
                }
            });
        },
    
            /**
         * Creates and records log as custom Events, for use in New Relic Insights.
         * The event includes a list of attributes, specified as a map.
         * @param {string} eventType The type of event.
         * @param {string} eventName The name of the event.
         * @param {Map<string, string|number>} attributes A map that includes a list of attributes.
         */
            recordLogs: function (eventType, eventName, attributes, cb, fail) {
                const customEvent = new NewRelicEvent({ eventType, eventName, attributes });
                customEvent.attributes.isValid(() => {
                    if (customEvent.eventName.isValid() && customEvent.eventType.isValid()) {
                        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordLogs", [eventType, eventName, customEvent.attributes.value]);
                    } else {
                        window.console.error("Invalid event name or type in recordCustomEvent");
                    }
                });
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

        /**
         * Send a message to the New Relic Mobile agent logs.
         * @param type A string that represents the type of the console log. It can be 'error', 'warn', 'log', 'debug', or 'assert'.
         * @param args An array of arguments that are passed to the console log.
         */
        sendConsole(type, args) {

            NewRelic.getConsoleLogFeatureFlag().then((flag) => {

            if(flag.consoleLogEnabled === 'true') {
            const argsStr = JSON.stringify(args, getCircularReplacer());

            switch (type) {
                case 'error':
                  this.logError(`[CONSOLE][ERROR]${argsStr}`);
                  break;
                case 'warn':
                  this.logWarn(`[CONSOLE][WARN]${argsStr}`);
                  break;
                case 'log':
                  this.logInfo(`[CONSOLE][LOG]${argsStr}`);
                  break;
                case 'debug':
                  this.logDebug(`[CONSOLE][DEBUG]${argsStr}`);
                  break;
                case 'assert':
                  this.logVerbose(`[CONSOLE][ASSERT]${argsStr}`);
                  break;
              }}
              });
        },
    
        send(name, args) {
            const nameStr = String(name);
            const argsStr = {};
            Object.keys(args).forEach(key => {
                argsStr[String(key)] = String(args[key]);
            });
    
            this.recordLogs("consoleEvents", name, args);
        },
    
        /**
         * Records JavaScript errors for Cordova.
         * @param {Error} err The error to record.
         * @param {Map<string, boolean|number|string>} attributes Optional attributes that will be appended to the handled exception event created in insights.
         */
        recordError: function(err, attributes={}, cb, fail) {
            let errorAttributes = attributes instanceof Map ? Object.fromEntries(attributes) : attributes;
            if (attributes === null) {
                errorAttributes = {};
            }
            if (err) {
                var error;

                if (err instanceof Error) {
                    error = err;
                }

                if (typeof err === 'string') {
                    error = new Error(err || '');
                }

                if(error !== undefined) {
                    cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordError", [error.name, error.message, error.stack, false, errorAttributes]);
                } else {
                    window.console.warn('Undefined error in NewRelic.recordError');
                }

            } else {
                window.console.warn('Error is required in NewRelic.recordError');
            }
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
         * Sets the maximum size of total data that can be stored for offline storage..
         * @param {number} maxPoolSize The Maximum size in megaBytes that can be stored in the file system.
         */
         setMaxOfflineStorageSize: function (megaBytes, cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setMaxOfflineStorageSize", [megaBytes]);
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

        /**
         * Shut down the agent within the current application lifecycle during runtime.
         * Once the agent has shut down, it cannot be restarted within the current application lifecycle.
         */
        shutdown: function (cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "shutdown");
        },

        addHTTPHeadersTrackingFor: function (headers,cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "addHTTPHeadersTrackingFor",[headers]);
        },

        getHTTPHeadersTrackingFor: function (cb, fail) {

            return new Promise(function (cb, fail) {
                cordova.exec(cb, fail, "NewRelicCordovaPlugin", "getHTTPHeadersTrackingFor");
            });
        },

        getConsoleLogFeatureFlag: function (cb, fail) {

         return new Promise(function (cb, fail) {
                cordova.exec(cb, fail, "NewRelicCordovaPlugin", "getConsoleLogFeatureFlag");
         });
        },

        generateDistributedTracingHeaders: function (cb, fail) {

            return new Promise(function (cb, fail) {
                cordova.exec(cb, fail, "NewRelicCordovaPlugin", "generateDistributedTracingHeaders");
            });
        },

        /**
         * Logs an informational message using the NewRelicCordovaPlugin.
         *
         * @param {string} message - The message to be logged.
         * @param {function} cb - The callback function to be executed upon successful execution of the logInfo method.
         * @param {function} fail - The callback function to be executed if the logInfo method fails.
         */
        logInfo: function (message, cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "logInfo", [message]);
        },


        /**
         * Logs an error message using the NewRelicCordovaPlugin.
         *
         * @param {string} message - The error message to be logged.
         * @param {function} cb - The callback function to be executed upon successful execution of the logError method.
         * @param {function} fail - The callback function to be executed if the logError method fails.
         */
        logError: function (message, cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "logError", [message]);
        },

        /**
         * Logs a warning message using the NewRelicCordovaPlugin.
         *
         * @param {string} message - The warning message to be logged.
         * @param {function} cb - The callback function to be executed upon successful execution of the logWarn method.
         * @param {function} fail - The callback function to be executed if the logWarn method fails.
         */
        logWarn: function (message, cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "logWarn", [message]);
        },

        /**
         * Logs a debug message using the NewRelicCordovaPlugin.
         *
         * @param {string} message - The debug message to be logged.
         * @param {function} cb - The callback function to be executed upon successful execution of the logDebug method.
         * @param {function} fail - The callback function to be executed if the logDebug method fails.
         */
        logDebug: function (message, cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "logDebug", [message]);
        },

        /**
         * Logs a verbose message using the NewRelicCordovaPlugin.
         *
         * @param {string} message - The verbose message to be logged.
         * @param {function} cb - The callback function to be executed upon successful execution of the logVerbose method.
         * @param {function} fail - The callback function to be executed if the logVerbose method fails.
         */
        logVerbose: function (message, cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "logVerbose", [message]);
        },

        /**
         * Logs a message with a specified log level using the NewRelicCordovaPlugin.
         *
         * @param {string} logLevel - The log level of the message to be logged.
         * @param {string} message - The message to be logged.
         * @param {function} cb - The callback function to be executed upon successful execution of the log method.
         * @param {function} fail - The callback function to be executed if the log method fails.
         */
        log:function (logLevel, message, cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "log", [logLevel, message]);
        },

        /**
         * Logs attributes using the NewRelicCordovaPlugin.
         *
         * @param {Map<string, string|number>} attributes - The attributes to be logged.
         * @param {function} cb - The callback function to be executed upon successful execution of the logAttributes method.
         * @param {function} fail - The callback function to be executed if the logAttributes method fails.
         */
        logAttributes: function (attributes, cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "logAttributes", [attributes]);
        },

        /**
         * Logs all attributes using the NewRelicCordovaPlugin.
         *
         * @param {Error} err The error to record.
         * * @param {Map<string, string|number>} attributes - The attributes to be logged.
         * @param {function} cb - The callback function to be executed upon successful execution of the logAll method.
         * @param {function} fail - The callback function to be executed if the logAll method fails.
         */
        logAll:function (err,attributes = {}, cb, fail) {
            if (attributes === null) {
                attributes = {};
            }
            if (err) {
                var error;

                if (err instanceof Error) {
                    error = err;
                }

                if (typeof err === 'string') {
                    error = new Error(err || '');
                }
            }
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "logAll", [error.message,attributes]);
        }
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
        try {
            return originalXhrOpen.apply(this, arguments)
            } catch (e) {
                console.error(e);
            } finally{
                    var headers = generateTracePayload();
                    console.debug(headers);
                    if (headers !== null) {
                      if (headers['newrelic']) {
                          this.setRequestHeader("newrelic", headers['newrelic']);
                      }
                      if (headers['traceparent']) {
                      this.setRequestHeader("traceparent", headers['traceparent']);
                      }
                      if (headers['tracestate']) {
                      this.setRequestHeader("tracestate", headers['tracestate']);
                      }
                      networkRequest.params = headers;
                  }
                }
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

                        const type = this.responseType;
                        if (type === "arraybuffer") {
                          networkRequest.bytesreceived = this.response.byteLength;
                        } else if (type === "blob") {
                          networkRequest.bytesreceived = this.response.size;
                        } else if (type === "text" || type === "" || type === undefined) {
                          networkRequest.bytesreceived = this.responseText.length;
                          networkRequest.body = this.responseText;
                        } else {
                          // unsupported response type
                          networkRequest.bytesreceived = 0;
                          networkRequest.body = "";
                        }

                        if(isValidURL(networkRequest.url)) {
                        NewRelic.noticeHttpTransaction(networkRequest.url, networkRequest.method, networkRequest.status, networkRequest.startTime, networkRequest.endTime, networkRequest.bytesSent, networkRequest.bytesreceived, networkRequest.body,networkRequest.params);
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
            const err = new Error();
            err.name = event.message;
            err.message = (event.error) ? event.error.message : '';
            err.stack = (event.error) ? event.error.stack : '';
            NewRelic.recordError(err);
        } else if (cordova.platformId == "iOS") {
            const err = new Error();
            err.name = event.message;
            err.message = '';
            err.stack = '';
            NewRelic.recordError(err);
        }
    });
    
    try {
        window.addEventListener('unhandledrejection', (e) => {
            const err = new Error(`${e.reason}`)
            NewRelic.recordError(err);
        })
    } catch (err) {
        // do nothing -- addEventListener is not supported
    }
    
    const oldFetch = window.fetch;
    
    window.fetch = function fetch() {
      var _arguments = arguments;
      var urlOrRequest = arguments[0];
      var options = arguments[1];
    
     return NewRelic.getHTTPHeadersTrackingFor().then((trackingHeadersList)=>{
      return NewRelic.generateDistributedTracingHeaders().then((headers) => {
        console.log(headers);
        networkRequest.startTime = Date.now();
        if (urlOrRequest && typeof urlOrRequest === 'object') {
          networkRequest.url = urlOrRequest.url;
      
          if (options && 'method' in options) {
           networkRequest. method = options.method;
          } else if (urlOrRequest && 'method' in urlOrRequest) {
            networkRequest.method = urlOrRequest.method;
          }
        } else {
          networkRequest.url = urlOrRequest;
      
          if (options && 'method' in options) {
            networkRequest.method = options.method;
          }
        }
      
        if(options && 'headers' in options) {
          options.headers['newrelic'] = headers['newrelic'];
          options.headers['traceparent'] = headers['traceparent'];
          options.headers['tracestate'] = headers['tracestate'];
          networkRequest.params = {};
          JSON.parse(trackingHeadersList["headersList"]).forEach((e) => {
            if(options.headers[e] !== undefined) {
              networkRequest.params[e] = options.headers[e];
                
            }
          });
        } else {
           if(options === undefined) {
                  options = {};
           }
          options['headers'] = {};
          options.headers['newrelic'] = headers['newrelic'];
          options.headers['traceparent'] = headers['traceparent'];
          options.headers['tracestate'] = headers['tracestate'];
          _arguments[1] = options;
        }
    
        if (options && 'body' in options && options.body !== undefined) {
            networkRequest.bytesSent = options.body.length;
        } else {
            networkRequest.bytesSent = 0;
        }

        if (networkRequest.method === undefined || networkRequest.method === "") {
            networkRequest.method = 'GET';
        }
        return new Promise(function (resolve, reject) {
          // pass through to native fetch
          oldFetch.apply(void 0, _arguments).then(function(response) {
            handleFetchSuccess(response.clone(), networkRequest.method, networkRequest.url,networkRequest.startTime,headers,networkRequest.params);
            resolve(response)
          })["catch"](function (error) {
            NewRelic.recordError(error);
            reject(error);
          });
        });
        });
    
     });
     
    };
    

    function handleFetchSuccess(response, method, url, startTime,headers,params) {
        response.text().then((v)=>{

        if(isValidURL(url)) {
        NewRelic.noticeHttpTransaction(
          url,
          method,
          response.status,
          startTime,
          Date.now(),
          networkRequest.bytesSent,
          v.length,
          v,
          params,
          headers
         );
        }

        });
    }

    function generateTracePayload () {
     
        if (!accountId || !applicationId) {
          return null
        }
    
        var guid = generateSpanId()
        var traceId = generateTraceId()
        var timestamp = Date.now()
    
        var payload = {
          guid,
          traceId
        }
        payload.id = guid;
        payload['trace.id'] = payload.traceId;
    
          payload.traceparent = generateTraceContextParentHeader(guid, traceId)
          payload.tracestate = generateTraceContextStateHeader(guid, timestamp,
            accountId, applicationId, trustAccountKey)

          payload.newrelic = generateTraceHeader(guid, traceId, timestamp, accountId,
            applicationId, trustAccountKey)
        
    
        return payload
      }

      function generateSpanId() {
        return generateRandomHexString(16);
      }

      function generateTraceId() {
        return generateRandomHexString(32);
      }

    function generateRandomHexString(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
    
      function generateTraceContextParentHeader (spanId, traceId) {
        return '00-' + traceId + '-' + spanId + '-01'
      }
    
      function generateTraceContextStateHeader (spanId, timestamp, accountId, appId, trustKey) {
        var version = 0
        var transactionId = ''
        var parentType = 2
        var sampled = ''
        var priority = ''
    
        return trustKey + '@nr=' + version + '-' + parentType + '-' + accountId +
          '-' + appId + '-' + spanId + '-' + transactionId + '-' + sampled + '-' + priority + '-' + timestamp
      }
    
      function generateTraceHeader (spanId, traceId, timestamp, accountId, appId, trustKey) {
    
        var payload = {
          v: [0, 2],
          d: {
            ty: 'Mobile',
            ac: accountId,
            ap: appId,
            id: spanId,
            tr: traceId,
            ti: timestamp
          }
        }
        if (trustKey && accountId !== trustKey) {
          payload.d.tk = trustKey
        }
    
        return btoa(JSON.stringify(payload))
      }

      document.addEventListener('deviceready', function () {
        NewRelic.generateDistributedTracingHeaders().then((headers) => {
            accountId = headers['account.id'];
            applicationId = headers['application.id'];
            trustAccountKey = headers['trust.account.key'];
        });
    });

    function isValidURL(url) {
        try {
          const newUrl = new URL(url);
          return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
        } catch (err) {
          return false;
        }
      }

    const defaultLog = window.console.log;
    const defaultWarn = window.console.warn;
    const defaultError = window.console.error;
    const defaultDebug = window.console.debug;
    const defaultAssert = window.console.assert;



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

    console.debug = function () {
        NewRelic.sendConsole('debug', arguments);
        defaultDebug.apply(console, arguments);
    };

    console.assert = function () {
        NewRelic.sendConsole('assert', arguments);
        defaultAssert.apply(console, arguments);
    };
    
    class Utils {
        static isObject(value) {
          return value instanceof Object && !(value instanceof Array);
        }
    
        static isString(value) {
          return typeof value === 'string' || value instanceof String;
        }
    
        static isBool(value) {
          return typeof value === 'boolean' || value instanceof Boolean;
        }
    
        static isNumber(value) {
          return !Number.isNaN(parseFloat(value)) && Number.isFinite(value);
        }
    
        static notEmptyString(value) {
          return value && value.length !== 0;
        }
    
        static hasValidAttributes(attributes) {
          return Utils.isObject(attributes) && attributes !== null;
        }
    }
    
    class Validator {
        constructor() {
            this.isString = 'isString';
    
            this.isBool = 'isBool';
    
            this.isNumber = 'isNumber';
    
            this.isObject = 'isObject';
    
            this.notEmptyString = 'notEmptyString';
    
            this.hasValidAttributes = 'hasValidAttributes';
    
            this.validate = (value, rules, msg) => rules.every((rule) => {
                const isValid = Utils[rule](value);
                if (!isValid) {
                    window.console.error(msg);
                }
                return Utils[rule](value);
            });
        }
    }
    
    class Rule {
        constructor(value, rules = [], message) {
          this.value = value;
          this.rules = rules;
          this.message = message;
          this.validator = new Validator();
        }
    
        isValid(isValid = val => val, failedValidation = val => val) {
          const hasValidValues = this.validator.validate(this.value, this.rules, this.message);
    
          if (hasValidValues) {
            isValid();
          } else {
            failedValidation(hasValidValues, this.message);
          }
    
          return hasValidValues;
        }
    };
    
    const BreadCrumb = class CustomEvent {
        constructor({ eventName, attributes }) {
          let validator = new Validator();  
          this.eventName = new Rule(eventName,
            [validator.isString, validator.notEmptyString],
            `eventName '${eventName}' is not a string.`);
          this.attributes = new Rule( attributes instanceof Map ? Object.fromEntries(attributes):attributes,
            [validator.isObject, validator.hasValidAttributes],
            `attributes '${attributes}' are not valid.`);
        }
    };
    
    const NewRelicEvent = class CustomEvent {
        constructor({ eventName = '', attributes, eventType }) {
          let validator = new Validator();  
          this.eventType = new Rule(eventType,
            [validator.isString, validator.notEmptyString],
            `eventType '${eventType}' is not a string`);
    
          this.eventName = new Rule(eventName,
            [validator.isString],
            `eventName '${eventName}' is not a string`);
    
          this.attributes = new Rule( attributes instanceof Map ? Object.fromEntries(attributes):attributes,
            [validator.isObject, validator.hasValidAttributes],
            `attributes '${attributes}' are not valid.`);
        }
    };
    
    /**
     * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
     * Any copyright is dedicated to the Public Domain: https://creativecommons.org/publicdomain/zero/1.0/
     */
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
    };
    
    module.exports = NewRelic;