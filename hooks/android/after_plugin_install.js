/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

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
