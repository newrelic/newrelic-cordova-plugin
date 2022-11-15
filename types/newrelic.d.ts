/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

export function noticeHttpTransaction(
  url: string,
  method: string,
  status: number,
  startTime: number,
  endTime: number,
  bytesSent: number,
  bytesReceived: number,
  body: string,
  cb: any,
  fail: any
): void;
export function noticeDistributedTrace(cb: any, fail: any): void;
export function setUserId(userId: string, cb: any, fail: any): void;
export function setAttribute(
  name: string,
  value: any,
  cb: any,
  fail: any
): void;
export function removeAttribute(name: string, cb: any, fail: any): void;
export function recordBreadcrumb(
  name: string,
  eventAttributes: Map<string, string | number>,
  cb: any,
  fail: any
): void;
export function recordCustomEvent(
  eventType: string,
  eventName: string,
  attributes: Map<string, string | number>,
  cb: any,
  fail: any
): void;
export function startInteraction(
  actionName: string,
  cb: Function,
  fail: any
): Promise<any>;
export function endInteraction(interactionId: string, cb: any, fail: any): void;
export function sendConsole(type: any, args: any): void;
export function send(name: any, args: any): void;
/**
 * Records JavaScript errors for Cordova.
 * @param {Error} err The name of the error.
 */
export function recordError(err: Error, cb: any, fail: any): void;
export function crashNow(message: string, cb: any, fail: any): void;
export function currentSessionId(cb: Function, fail: any): Promise<any>;
export function incrementAttribute(
  name: string,
  value: number,
  cb: any,
  fail: any
): void;
export function noticeNetworkFailure(
  url: string,
  httpMethod: string,
  startTime: number,
  endTime: number,
  failure: string,
  cb: any,
  fail: any
): void;
export function recordMetric(
  name: string,
  category: string,
  value: number,
  countUnit: string,
  valueUnit: string,
  cb: any,
  fail: any
): void;
export function removeAllAttributes(cb: any, fail: any): void;
export function setMaxEventBufferTime(
  maxBufferTimeInSeconds: number,
  cb: any,
  fail: any
): void;
export function setMaxEventPoolSize(
  maxPoolSize: number,
  cb: any,
  fail: any
): void;
export function analyticsEventEnabled(
  enabled: boolean,
  cb: any,
  fail: any
): void;
export function networkRequestEnabled(
  enabled: boolean,
  cb: any,
  fail: any
): void;
export function networkErrorRequestEnabled(
  enabled: boolean,
  cb: any,
  fail: any
): void;
export function httpRequestBodyCaptureEnabled(
  enabled: boolean,
  cb: any,
  fail: any
): void;
