var ios = require('./ios');

module.exports = function (context) {
  ios.verifyPlatformInstall(context);
  if(ios.isPlatformConfigured()) {
    ios.removePostBuildScript(context);
    ios.injectPostBuildScript(context);
  }
};
