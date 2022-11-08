/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

/** @module Newrelic utilities */
var path = require("path");
var fs = require("fs");
//todo: maybe use the path object?
var rootDir = require('process').cwd();

/**
 * @desc Helper methods to read and write files and to get information about the project.
 * @type {{pluginId: module.exports.pluginId, appConfig: module.exports.appConfig, appName: module.exports.appName, platformConfigPath: module.exports.platformConfigPath, platformConfig: module.exports.platformConfig, pluginConfig: module.exports.pluginConfig, xcodeBuildPath: module.exports.xcodeBuildPath, slurpFile: module.exports.slurpFile, writeFile: module.exports.writeFile}}
 */
module.exports = {
  /**
   * Helper method to get the plugin ID.
   * @returns {string} - the new relic plugin ID.
   */
  pluginName: function () {
    return "newrelic-cordova-plugin";
  },

  /**
   * Use the cordova context to parse the config.xml
   * @param context {Object} - Cordova context
   * @returns {Object} - Cordova Config
   */
  appConfig: function (context) {
    var ConfigParser = context.requireCordovaModule("cordova-lib").configparser;
    return new ConfigParser("config.xml");
  },

  /**
   * Get the app name from the config.xml
   * @param context {object} - Cordova context object
   * @returns {String} - Config.xml name
   */
  appName: function (context) {
    return this.appConfig(context).name();
  },

  /**
   * Get the path to the platform configs.
   * @param platform {String} - the platform android, ios, etc.
   * @returns {string}
   */
  platformConfigPath: function (platform) {
    return path.join(rootDir, "platforms", platform, platform + ".json");
  },

  /**
   * Get the platform Config .JSON
   * @param platform {String} - the platform Android, iOS, etc.
   * @returns {Object} - JSON object of the platform config
   */
  platformConfig: function (platform) {
    return require(this.platformConfigPath(platform));
  },

  /**
   * Returns the ios config
   * @returns {{appToken: *, agentVer: *}}
   */
  getIosConfig: function () {
    var meta = this.getPlatformMeta('ios');
    if (meta && meta.config.installed_plugins[meta.name]) {
      return {
        appToken: meta.config.installed_plugins[meta.name].IOS_APP_TOKEN,
      }
    } else {
      return {}
    }
  },

  /**
   * Returns the Android config
   * @returns {{appToken: *, agentVer: *}}
   */
  getAndroidConfig: function () {
    var meta = this.getPlatformMeta('android');
    if (meta && meta.config.installed_plugins[meta.name]) {
      return {
        appToken: meta.config.installed_plugins[meta.name].ANDROID_APP_TOKEN,
        agentVer: meta.config.installed_plugins[meta.name].ANDROID_AGENT_VER
      }
    } else {
      return {}
    }
  },

  /**
   * Get meta platform data about the project.
   * @param platform {String} - the platform android, ios, etc.
   * @returns {{id: *, config: *}}
   */
  getPlatformMeta: function (platform) {
    return {
      name: this.pluginName(),
      config: this.platformConfig(platform)
    }
  },

  /**
   * get gradle script as string
   * @param path
   * @returns {String} - Gradle script as a string
   */
  slurpFile: function (path) {
    return fs.readFileSync(path, "utf-8");
  },

  /**
   * Write contents to a path
   * @param path {String}
   * @param contents {String}
   */
  writeFile: function (path, contents) {
    fs.writeFileSync(path, contents);
  },

  /**
   * Return {boolean} - if this platform exists and has been configured with an application token
   */
  isPlatformConfigured: function (config) {
    return (config && config.hasOwnProperty('appToken') && config.appToken !== 'x');
  },

  warnPlatformNotConfigured: function (platform) {
    console.log('[newrelic.warn]: An ' + platform + ' platform exists, but an ' + platform + ' New Relic application token was not provided when "' + this.pluginName() + '" was added.\n' +
      'To use the plugin on ' + platform + ', reinstall and provide an ' + platform + ' application token:\n\n' +
      "'cordova plugin rm " + this.pluginName() + "'\n" +
      "'cordova plugin add <plugin repo> --variable IOS_APP_TOKEN=<iOS application id> --variable ANDROID_APP_TOKEN=<Android application id>'\n");
  }

};
