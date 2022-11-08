/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

/**
 * @desc Script Phase helper object.
 * @param args {{isa: string, buildActionMask: number, files: Array, inputPaths: Array, name: string, outputPaths: Array, runOnlyForDeploymentPostprocessing: number, shellPath: string, shellScript: *, showEnvVarsInLog: number}}
 * @constructor
 */
function ScriptPhase(args) {
  if (args === undefined) {
    args = {}
  }
  this.isa = args.isa || "PBXShellScriptBuildPhase";
  this.buildActionMask = args.buildActionMask || 2147483647;
  this.files = args.files || [];
  this.inputPaths = args.inputPaths || [];
  this.name = args.name;
  this.outputPaths = args.outputPaths || [];
  this.runOnlyForDeploymentPostprocessing = args.runOnlyForDeploymentPostprocessing;
  this.shellPath = args.shellPath || '/bin/sh';
  this.shellScript = args.shellScript;
  this.showEnvVarsInLog = args.showEnvVarsInLog;
}

module.exports = ScriptPhase;