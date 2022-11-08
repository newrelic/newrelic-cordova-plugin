/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

var iosHelper = require('./ios');

module.exports = function (context) {
  iosHelper.removePostBuildScript(context);
};

