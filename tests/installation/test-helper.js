/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

var projectName = "newrelictest";
var workingDirectory = "/tmp/" + projectName;
var processDir = process.cwd().replace(/ /g, '\\ ');

module.exports = {

  createProject: function () {
    return 'cordova create ' + workingDirectory + ' com.newrelic.cordova.plugin.newrelictest ' + projectName
  },

  jumpToWorkingDirectory: function () {
    return 'cd ' + workingDirectory
  },

  removeProject: function () {
    return 'rm -rf ' + workingDirectory;
  },

  addPlatform: function (platform) {
    return this.jumpToWorkingDirectory() + '; cordova platform add ' + platform + ' --save'
  },

  removePlatform: function (platform) {
    return this.jumpToWorkingDirectory() + '; cordova platform remove ' + platform + ' --save'
  },

  installPlugin: function () {
    return this.jumpToWorkingDirectory() + '; cordova plugin add  ' + processDir + ' --save --variable ANDROID_APP_TOKEN=1234 --variable IOS_APP_TOKEN=12345'
  },

  installPluginiOS: function () {
    return this.jumpToWorkingDirectory() + '; cordova plugin add  ' + processDir + ' --save --variable IOS_APP_TOKEN=123456'
  },

  installPluginAndroid: function () {
    return this.jumpToWorkingDirectory() + '; cordova plugin add  ' + processDir + ' --save --variable ANDROID_APP_TOKEN=1234'
  },

  buildGradlePath: function () {
    return workingDirectory + '/platforms/android/app/build.gradle'
  },

  buildApps: function () {
    return this.jumpToWorkingDirectory() + '; cordova build --verbose > cordova-build.log'
  },

  buildLogPath: function () {
    return workingDirectory + '/cordova-build.log'
  },

  removePlugin: function () {
    return this.jumpToWorkingDirectory() + '; cordova plugin remove newrelic-cordova-plugin --save'
  },

  iosXcodeProject: function () {
    return workingDirectory + '/platforms/ios/' + projectName + '.xcodeproj/project.pbxproj'
  }

};

