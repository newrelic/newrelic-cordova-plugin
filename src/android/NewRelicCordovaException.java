/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */
package com.newrelic.cordova.plugin;

public class NewRelicCordovaException extends Exception {
  public NewRelicCordovaException(String message, StackTraceElement[] stackTraceElements) {
    super(message);
    setStackTrace(stackTraceElements);
  }
}