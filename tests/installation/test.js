/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

/**
 * all shell js commands run from the root of the project
 */
var assert = require('chai').assert;
var shell = require('shelljs');
var helper = require('./test-helper');
var fs = require('fs');

var iOSAgentTag = 'name = "New Relic dSYM Upload"';

describe('Verify plugin lifecycle', function () {
  //lets wait a while for this all to run
  this.timeout(600000);

  after(function (done) {
    shell.exec(helper.removeProject(), done);
  });

  describe('the plugin should support cordova project lifecycle', function () {

    before(function (done) {
      shell.exec(helper.removeProject(), done);
    });

    it('cordova should setup the project', function (done) {
      shell.exec(helper.createProject(), done);
    });

    it('cordova should add the iOS platform', function (done) {
      shell.exec(helper.addPlatform('ios'), done);
    });

    it('cordova should add the Android platform', function (done) {
      shell.exec(helper.addPlatform('android'), done);
    });

    it('cordova should install NewRelic plugin', function (done) {
      shell.exec(helper.installPlugin(), done);
    });

    it('NewRelic agent should be injected', function (done) {
      fs.readFile(helper.buildGradlePath(), function (err, gradleFile) {
        assert.notEqual(gradleFile.indexOf('NEWRELIC ADDED'), -1, "NewRelic Android agent not injected");
        done();
      });
    });

    it('NewRelic Gradle plugin should be injected', function (done) {
      fs.readFile(helper.buildGradlePath(), function (err, gradleFile) {
        assert.notEqual(gradleFile.indexOf('com.newrelic.agent.android:agent-gradle-plugin:'), -1, "NewRelic Gradle plugin not injected");
        done();
      });
    });

    it('iOS agent should be injected into the app', function (done) {
      fs.readFile(helper.iosXcodeProject(), function (err, buildLog) {
        assert.notEqual(buildLog.indexOf(iOSAgentTag), -1, "NewRelic Xcode task(s) not found");
        done();
      });
    });

    it('cordova should build the app successfully with NewRelic installed', function (done) {
      shell.exec(helper.buildApps(), done);
    });

    it('NewRelic agent should be in the build', function (done) {
      fs.readFile(helper.buildLogPath(), function (err, buildLog) {
        assert.notEqual(buildLog.indexOf('newrelicConfig'), -1, "NewRelic Gradle tasks(s) not found");
        done();
      });
    });

    it('cordova should remove the NewRelic plugin', function (done) {
      shell.exec(helper.removePlugin(), done);
    });

    it('cordova should remove the iOS platform', function (done) {
      shell.exec(helper.removePlatform('ios'), done);
    });

    it('cordova should remove the Android platform', function (done) {
      shell.exec(helper.removePlatform('android'), done);
    });

  });
});

describe('removing the plugin should remove all instances of it.', function () {
  this.timeout(600000);

  before(function (done) {
    shell.exec(helper.removeProject(), done);
  });

  it('cordova should setup the project', function (done) {
    shell.exec(helper.createProject(), done);
  });

  it('cordova should add the iOS platform', function (done) {
    shell.exec(helper.addPlatform('ios'), done);
  });

  it('cordova should add the Android platform', function (done) {
    shell.exec(helper.addPlatform('android'), done);
  });

  it('cordova should install NewRelic plugin', function (done) {
    shell.exec(helper.installPlugin(), done);
  });

  it('cordova should remove the NewRelic plugin', function (done) {
    shell.exec(helper.removePlugin(), done);
  });

  it('Android agent should not be injected', function (done) {
    fs.readFile(helper.buildGradlePath(), function (err, gradleFile) {
      assert.equal(gradleFile.indexOf('NEWRELIC ADDED'), -1, "Android build still present");
      done();
    });
  });

  it('NewRelic Gradle plugin should not be injected', function (done) {
    fs.readFile(helper.buildGradlePath(), function (err, gradleFile) {
      assert.equal(gradleFile.indexOf('com.newrelic.agent.android:agent-gradle-plugin:'), -1, "NewRelic Gradle plugin still present");
      done();
    });
  });

  it('iOS agent should not be in injected', function (done) {
    fs.readFile(helper.iosXcodeProject(), function (err, buildLog) {
      assert.equal(buildLog.indexOf(iOSAgentTag), -1, "NewRelic Xcode task still present");
      done();
    });
  });

  it('cordova should build the app successfully without NewRelic installed', function (done) {
    shell.exec(helper.buildApps(), done);
  });

  it('Android agent should not be in the build', function (done) {
    fs.readFile(helper.buildLogPath(), function (err, buildLog) {
      assert.equal(buildLog.indexOf('newRelicInstrumentTask'), -1, "NewRelic Gradle task(s) still present");
      done();
    });
  });

});

describe('adding the plugin before any platforms exist should not fail', function () {
  this.timeout(600000);

  before(function (done) {
    shell.exec(helper.removeProject(), done);
  });

  it('cordova should setup the project', function (done) {
    shell.exec(helper.createProject(), done);
  });

  it('cordova should install new relic plugin', function (done) {
    shell.exec(helper.installPlugin(), done);
  });

  it('cordova should install platforms', function (done) {
    shell.exec(helper.addPlatform('ios android'), done);
  });

});
