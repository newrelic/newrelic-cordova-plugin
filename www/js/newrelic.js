var exec = require("cordova/exec");

var NewRelic = {
    noticeHttpTransaction: function (url, method, status, startTime, endTime, bytesSent, bytesreceived, body, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "noticeHttpTransaction", [url, method, status, startTime, endTime, bytesSent, bytesreceived, body]);
    },

    noticeDistributedTrace: function (cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "noticeDistributedTrace");
    },

    setUserId: function (userId, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setUserId", [userId]);
    },

    setAttribute: function (name, value, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setAttribute", [name, value]);
    },

    removeAttribute: function (name, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "removeAttribute", [name, value]);
    },

    recordBreadcrumb: function (name, eventAttributes, cb, fail) {
        if (eventAttributes === undefined) {
            eventAttributes = {}
        }
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordBreadCrumb", [name, eventAttributes]);
    },

    recordCustomEvent: function (eventType, eventName, attributes, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordCustomEvent", [eventType, eventName, attributes]);
    },

    startInteraction: function (actionName, cb, fail) {
        return new Promise(function(cb, fail) {
            cordova.exec(cb, fail, "NewRelicCordovaPlugin", "startInteraction", [actionName]);
        });
    },

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
    recordError(name, message, stack, isFatal, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordError", [name, message, stack, isFatal]);
    }


}

netwoekRequest = {};
window.XMLHttpRequest.prototype.open = function (method, url) {
    // Keep track of the method and url
    // start time is tracked by the `send` method

    // eslint-disable-next-line prefer-rest-params
    console.log("nis" + method);
    console.log(url);
    netwoekRequest.url = url;
    netwoekRequest.method = method;
    netwoekRequest.bytesSent = 0;
    netwoekRequest.startTime = Date.now();
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
                    netwoekRequest.endTime = Date.now();
                    netwoekRequest.status = this.status;
                    netwoekRequest.bytesreceived = this.responseText.length;
                    netwoekRequest.body = this.responseText;

                    if (this.response) {
                        if (this.responseType === 'blob') {
                            var responseText = await (new Response(this.response)).text();
                            console.log("3" + responseText);


                        } else if (this.responseType === 'text') {
                            console.log("3" + this.response);
                        }

                        NewRelic.noticeHttpTransaction(netwoekRequest.url, netwoekRequest.method, netwoekRequest.status, netwoekRequest.startTime, netwoekRequest.endTime, netwoekRequest.bytesSent, netwoekRequest.bytesreceived, netwoekRequest.body);

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
