/**
 * Created by awashington on 8/4/17.
 */


var fs = require("fs");
var linkPath = "plugins/newrelic-cordova-plugin/libs/ios/NewRelicAgent.framework/";
var targetPath = "Versions/A/";

module.exports = function (context) {
    if(!fs.existsSync(linkPath + 'NewRelicAgent')){
        fs.symlinkSync(targetPath + 'Headers/', linkPath + 'Headers', 'dir');
        fs.symlinkSync(targetPath + 'NewRelicAgent', linkPath + 'NewRelicAgent', 'file');
        fs.symlinkSync(targetPath + 'Resources/', linkPath + 'Resources', 'dir');
    }

}
