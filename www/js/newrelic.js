var exec = require("cordova/exec");

var	NewRelic = {
    leaveBreadcrumb: function(breadCrumb) {
        cordova.exec(success, fail, "NewRelicCordovaPlugin", "recordBreadCrumb", [breadCrumb]);
        return this;
    }
}

module.exports = NewRelic;
