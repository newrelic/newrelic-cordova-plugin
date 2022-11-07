/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

var android = require("./android");

module.exports = function (context) {
  android.removeAgentPlugin();
};
