var iosHelper = require('./ios');

module.exports = function (context) {
  iosHelper.removePostBuildScript(context);
};

