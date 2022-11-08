/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

/** @module iOS */
var fs = require("fs");
var path = require("path");
var newrelic = require("../newrelic");
var ScriptPhase = require("./script-phase");
var xcode = require("xcode");

/**
 * @desc iOS Object to remove and add New Relic build scripts to the xCode Project.
 * @type {{scriptTitle: string,
 * commentTag: string,
 * projectBuildPhaseScript: string,
 * projectNativeTarget: string,
 * xcodePath: module.exports.xcodePath,
 * uploadShellScript: module.exports.uploadShellScript,
 * addUploadScriptToProject: module.exports.addUploadScriptToProject,
 * _filterBuildPhases: module.exports._filterBuildPhases,
 * getProjectObject: module.exports.getProjectObject,
 * removeUploadScriptFromProject: module.exports.removeUploadScriptFromProject,
 * getXcodeProject: module.exports.getXcodeProject,
 * injectPostBuildScript: module.exports.injectPostBuildScript,
 * removePostBuildScript: module.exports.removePostBuildScript}}
 */
module.exports = {

  /**
   * Script title
   */
  scriptTitle: '"New Relic dSYM Upload"',

  /**
   * Tag
   */
  commentTag: '_comment',

  /**
   * build phase script
   */
  projectBuildPhaseScript: 'PBXShellScriptBuildPhase',

  /**
   * native target
   */
  projectNativeTarget: 'PBXNativeTarget',

  /**
   * Return location of project's Xcode project (.pbxproj) file
   * @param context {Object} - Cordova context
   * @returns {string} - location of project's Xcode .pbxproj file
   */
  xcodePath: function (context) {
    return path.join("platforms", "ios", newrelic.appName(context) + ".xcodeproj", "project.pbxproj");
  },

  /**
   * Upload shell script, that will be added to the build phase.
   * @returns {string}
   */
  uploadShellScript: function () {
    return [
      ' "',
      'SCRIPT=`/usr/bin/find \\"${SRCROOT}\\" -name newrelic_postbuild.sh | head -n 1`;',
      '/bin/sh \\"${SCRIPT}\\" \\"' + newrelic.getIosConfig().appToken + '\\";',
      ' "'
    ].join("");
  },

  /**
   * Add our upload script to nativeTarget.buildPhases. This gets save by xcodeProject.writeSync.
   * @param project {Object} - Cordova Project Object
   */
  addUploadScriptToProject: function (project) {
    var uuid = project.generateUuid();
    var projectShellBuildPhase = this.getProjectObject(project, this.projectBuildPhaseScript);
    var projectNativeTargets = this.getProjectObject(project, this.projectNativeTarget);

    var scriptPhase = new ScriptPhase({
      name: this.scriptTitle,
      runOnlyForDeploymentPostprocessing: 0,
      shellScript: this.uploadShellScript(),
      showEnvVarsInLog: 0
    });

    projectShellBuildPhase[uuid] = scriptPhase;

    projectShellBuildPhase[uuid + this.commentTag] = scriptPhase.name;

    for (var nativeTargetId in projectNativeTargets) {

      if (nativeTargetId.indexOf(this.commentTag) !== -1) {
        continue;
      }

      var nativeTarget = projectNativeTargets[nativeTargetId];

      nativeTarget.buildPhases.push({
        value: uuid,
        comment: this.scriptTitle
      });

    }
  },

  /**
   * Filter our build phase if it matches our script title
   * @param buildPhase {Object} - buildphase from xcode project.
   * @returns {boolean}
   * @private
   */
  _filterBuildPhases: function (buildPhase) {
    return buildPhase.comment !== this.scriptTitle;
  },

  /**
   * Get the Project
   * @param project {Object} - Cordova project object
   * @param projectAttribute {String}
   * @returns {*}
   */
  getProjectObject: function (project, projectAttribute) {
    return project.hash.project.objects[projectAttribute]
  },

  /**
   * Remove the upload script from the nativeTarget.buildPhases object. This gets save by xcodeProject.writeSync
   * @param project {Object} - Cordova project object
   */
  removeUploadScriptFromProject: function (project) {
    var buildPhases = this.getProjectObject(project, this.projectBuildPhaseScript);
    var nativeTargets = this.getProjectObject(project, this.projectNativeTarget);

    for (var phaseId in buildPhases) {

      var buildPhase = buildPhases[phaseId];

      if (buildPhase.name === this.scriptTitle) {
        delete buildPhases[phaseId];
        delete buildPhases[phaseId + this.commentTag];
      }

      for (var nativeTargetId in nativeTargets) {

        var nativeTarget = nativeTargets[nativeTargetId];

        if (nativeTargetId.indexOf(this.commentTag) !== -1) {
          continue;
        }
        nativeTarget.buildPhases = nativeTarget.buildPhases.filter(this._filterBuildPhases);
      }

    }
  },

  /**
   * Get the xCode project
   * @param context {Object} - Cordova context
   * @returns {*}
   */
  getXcodeProject: function (context) {
    return xcode.project(this.xcodePath(context));
  },

  /**
   * Inject our scripts into the build phase
   * @param context {Object} - Cordova context
   */
  injectPostBuildScript: function (context) {
    var xcodeProject = this.getXcodeProject(context);
    xcodeProject.parseSync();

    this.addUploadScriptToProject(xcodeProject);
    newrelic.writeFile(this.xcodePath(context), xcodeProject.writeSync());
  },

  /**
   * Remove our scripts from the build phase
   * @param context {Object} - Cordova context
   */
  removePostBuildScript: function (context) {
    var xcodeProject = this.getXcodeProject(context);
    xcodeProject.parseSync();

    this.removeUploadScriptFromProject(xcodeProject);
    newrelic.writeFile(this.xcodePath(context), xcodeProject.writeSync());
  },

  /**
   * Return {boolean} - if this platform exists and has been configured with an application token
   */
  isPlatformConfigured: function () {
    var config = newrelic.getIosConfig();
    return newrelic.isPlatformConfigured(config);
  },

  /**
   * Verify the platform has been installed prior to running this task
   * @param context {Object} - Cordova context
   */
  verifyPlatformInstall: function (context) {
    if (!this.isPlatformConfigured()) {
      newrelic.warnPlatformNotConfigured('iOS');
    }
  }

};