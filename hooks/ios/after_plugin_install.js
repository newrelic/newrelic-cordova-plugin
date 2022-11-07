/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

var ios = require('./ios');

module.exports = function (context) {
  ios.verifyPlatformInstall(context);
  if (ios.isPlatformConfigured()) {
    ios.removePostBuildScript(context);
    ios.injectPostBuildScript(context);
  }
};
