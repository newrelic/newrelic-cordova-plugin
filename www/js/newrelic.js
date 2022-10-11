var exec = require("cordova/exec");

var	NewRelic = {
    noticeHttpTransaction: function (url, method, status, startTime, endTime, bytesSent, bytesreceived, body, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "noticeHttpTransaction", [url, method, status, startTime, endTime, bytesSent, bytesreceived, body]);
    },

    noticeDistributedTrace: function (cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "noticeDistributedTrace");
    },

    setUserId: function (userId, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setUserId", [userId]);
    },

    setAttribute: function (name,value, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "setAttribute", [name,value]);
    },

    removeAttribute: function (name, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "removeAttribute", [name,value]);
    },

    recordBreadcrumb: function (name,eventAttributes, cb, fail) {
        if(eventAttributes === undefined) {
            eventAttributes = {}
        }
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordBreadCrumb", [name,eventAttributes]);
    },

    recordCustomEvent: function (eventType,eventName, attributes, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "recordCustomEvent", [eventType, eventName, attributes]);
    },

    startInteraction: function (actionName, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "startInteraction", [actionName]);
    },

    endInteraction: function (interactionId, cb, fail) {
        cordova.exec(cb, fail, "NewRelicCordovaPlugin", "endInteraction", [interactionId]);
    },
}

var originalXhrOpen = window.XMLHttpRequest.prototype.open;
  var originalXHRSend = window.XMLHttpRequest.prototype.send;

    window.XMLHttpRequest.prototype.open = function ( method, url) {
      // Keep track of the method and url
      // start time is tracked by the `send` method

      // eslint-disable-next-line prefer-rest-params
      console.log("nis" + method);
      console.log(url);
      return originalXhrOpen.apply(this, arguments)

    }


    window.XMLHttpRequest.prototype.send = function(data) {

      console.log(data);

      if (this.addEventListener) {
        this.addEventListener(
          'readystatechange',async () =>{

            if (this.readyState === this.HEADERS_RECEIVED) {
              const contentTypeString = this.getResponseHeader('Content-Type');
              if (contentTypeString) {            
                console.log("1"+contentTypeString);
              }

              if (this.getAllResponseHeaders()) {
                const responseHeaders = this.getAllResponseHeaders().split('\r\n');
                const responseHeadersDictionary = {};
                responseHeaders.forEach(element => {
                  const key = element.split(':')[0];
                  const value = element.split(':')[1];
                  responseHeadersDictionary[key] = value;
                });
                console.log("2"+responseHeadersDictionary);
              }
            }
            if (this.readyState === this.DONE) {
              console.log("3"+this.status);

              if (this.response) {
                if (this.responseType === 'blob') {
                  var responseText =  await (new Response(this.response)).text();
                   console.log("3"+responseText);
              

                } else if (this.responseType === 'text') {
                   console.log ("3"+this.response);
                }
           
              }

            }
          },
          false
        );

      }
      console.log(Date.now());
      return originalXHRSend.apply(this, arguments);
    }

    const defaultLog = window.console.log;
    const defaultWarn = window.console.warn;
    const defaultError = window.console.error;
    const self = this;

    console.log = function() {
      defaultLog.apply(console, arguments);
    };
    console.warn = function() {
      defaultWarn.apply(console, arguments);
    };
    console.error = function() {
      defaultError.apply(console, arguments);
    };

window.onerror = function(msg, url, line, col, error) {
    // Note that col & error are new to the HTML 5 spec and may not be 
    // supported in every browser.  It worked for me in Chrome.
    var extra = !col ? '' : '\ncolumn: ' + col;
    extra += !error ? '' : '\nerror: ' + error;
 
    // You can view the information in an alert to see things working like this:
    console.log(error.stack);
    alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
 
    // TODO: Report this error via ajax so you can keep track
    //       of what pages have JS issues
 
    var suppressErrorAlert = true;
    // If you return true, then error alerts (like in older versions of 
    // Internet Explorer) will be suppressed.
    return suppressErrorAlert;
 };

 try {
  window.addEventListener('unhandledrejection', (e) => {
    const err = new Error(`${e.reason}`)
    console.log('unhandled promise rejection');
  })
} catch (err) {
  // do nothing -- addEventListener is not supported
}

module.exports = NewRelic;
