/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

/**
 * all shell js commands run from the root of the project
 */
var expect = require('chai').expect;
var shell = require('shelljs');
var helper = require('./test-helper');
var fs = require('fs');

describe('Verify Android agent life cycle', function () {
  //lets wait a while for this all to run
  this.timeout(150000);

  after(function (done) {
    shell.exec(helper.removeProject(), done);
  });

  describe('The Android plugin should install into a Cordova project', function () {

    before(function (done) {
      shell.exec(helper.removeProject(), done);
    });

    it('Cordova should setup the project', function (done) {
      shell.exec(helper.createProject(), done);
    });

    it('Cordova should add the Android platform', function (done) {
      shell.exec(helper.addPlatform('android'), done);
    });

    it('Cordova should install NewRelic plugin', function (done) {
      shell.exec(helper.installPluginAndroid(), done);
    });

    it('Android agent should be injected into app', function (done) {
      fs.readFile(helper.buildGradlePath(), function (err, gradleFile) {
        expect(gradleFile.indexOf('NEWRELIC')).to.not.equal(-1);
        done();
      });
    });

    it('Cordova should build the app successfully with NewRelic installed', function (done) {
      shell.exec(helper.buildApps(), done);
    });

    it('Android agent should be injected into the build', function (done) {
      fs.readFile(helper.buildLogPath(), function (err, buildLog) {
        expect(buildLog.indexOf('newrelicConfig')).to.not.equal(-1);
        done();
      });
    });

    it('Cordova should remove the NewRelic plugin', function (done) {
      shell.exec(helper.removePlugin(), done);
    });

    it('Android agent should be removed from the Gradle build', function (done) {
      fs.readFile(helper.buildGradlePath(), function (err, gradleFile) {
        expect(gradleFile.indexOf('NEWRELIC')).to.equal(-1);
        done();
      });
    });

  });

  describe('Plugin should install for Android agent only', function () {
    this.timeout(150000);

    before(function (done) {
      shell.exec(helper.removeProject(), done);
    });

    it('Cordova should setup the project', function (done) {
      shell.exec(helper.createProject(), done);
    });

    it('Cordova should setup the Android platform', function (done) {
      shell.exec(helper.addPlatform('android'), done);
    });

    it('Cordova should setup the iOS platform', function (done) {
      shell.exec(helper.addPlatform('ios'), done);
    });

    it('Cordova should warn on unconfigured iOS platform', function (done) {
      shell.exec(helper.installPluginAndroid(), function (code, out, err) {
        expect(out.indexOf('[newrelic.warn]: An iOS platform exists')).to.not.equal(-1);
        done();
      });
    });
  });

});
