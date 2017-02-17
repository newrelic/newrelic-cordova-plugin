var android = require("./android");

module.exports = function (context) {
  android.verifyPlatformInstall(context);
  var isConfigured = android.isPlatformConfigured();
  android.removeAgentPlugin();
  android.injectAgentPlugin(context, isConfigured);
  if (isConfigured) {
  	android.injectNewRelicProperties(context);
  }
};
