/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

exports.defineAutoTests = () => {
  describe('New Relic Cordova Plugin', () => {
    
    it('should exist', () => {
      expect(window.NewRelic).toBeDefined();
    });

    it('should have the expected static methods defined', () => {
      expect(window.NewRelic.noticeHttpTransaction).toBeDefined();
      expect(window.NewRelic.noticeDistributedTrace).toBeDefined();
      expect(window.NewRelic.setUserId).toBeDefined();
      expect(window.NewRelic.setAttribute).toBeDefined();
      expect(window.NewRelic.removeAttribute).toBeDefined();
      expect(window.NewRelic.recordBreadcrumb).toBeDefined();
      expect(window.NewRelic.recordCustomEvent).toBeDefined();
      expect(window.NewRelic.startInteraction).toBeDefined();
      expect(window.NewRelic.endInteraction).toBeDefined();
      expect(window.NewRelic.recordError).toBeDefined();
      expect(window.NewRelic.currentSessionId).toBeDefined();
      expect(window.NewRelic.incrementAttribute).toBeDefined();
      expect(window.NewRelic.recordMetric).toBeDefined();
      expect(window.NewRelic.removeAllAttributes).toBeDefined();
      expect(window.NewRelic.setMaxEventBufferTime).toBeDefined();
      expect(window.NewRelic.setMaxEventPoolSize).toBeDefined();
      expect(window.NewRelic.analyticsEventEnabled).toBeDefined();
      expect(window.NewRelic.networkRequestEnabled).toBeDefined();
      expect(window.NewRelic.networkErrorRequestEnabled).toBeDefined();
      expect(window.NewRelic.httpRequestBodyCaptureEnabled).toBeDefined();
    });

    it('should noticeHttpTransaction', () => {
      spyOn(window.NewRelic, "noticeHttpTransaction");
      window.NewRelic.noticeHttpTransaction("https://fakeurl.com", "GET", 200, Date.now(), Date.now(), 1000, 0);
      window.NewRelic.noticeHttpTransaction("https://fakeurl.com", "POST", 404, Date.now(), Date.now(), 1000, 0, "fake body");
      expect(window.NewRelic.noticeHttpTransaction).toHaveBeenCalledTimes(2);
    });

    it('should set userId', () => {
      spyOn(window.NewRelic, "setUserId");
      window.NewRelic.setUserId("fakeId")
      expect(window.NewRelic.setUserId).toHaveBeenCalledTimes(1);
    });

    it('should set attribute', () => {
      spyOn(window.NewRelic, "setAttribute");
      window.NewRelic.setAttribute('eventType', 123);
      window.NewRelic.setAttribute('eventType', true);
      window.NewRelic.setAttribute('eventType', 'eventName');
      window.NewRelic.setAttribute('eventType', false);
      expect(window.NewRelic.setAttribute).toHaveBeenCalledTimes(4);
    });

    it('should remove attribute', () => {
      spyOn(window.NewRelic, "removeAttribute");
      window.NewRelic.removeAttribute('eventType');
      expect(window.NewRelic.removeAttribute).toHaveBeenCalledTimes(1);
    });

    it('should record breadcrumb', () => {
      spyOn(window.NewRelic, "recordBreadcrumb");
      window.NewRelic.recordBreadcrumb('testName', { test: 123, valid: 'yes' });
      expect(window.NewRelic.recordBreadcrumb).toHaveBeenCalledTimes(1);
    });

    it('should record custom event', () => {
      spyOn(window.NewRelic, "recordCustomEvent");
      window.NewRelic.recordCustomEvent('eventType', 'eventName', { test: 123, valid: 'yes' });
      window.NewRelic.recordCustomEvent('eventType', '', { test: 123, valid: 'yes' });
      window.NewRelic.recordCustomEvent('eventType', undefined, { test: 123, valid: 'yes' });
      expect(window.NewRelic.recordCustomEvent).toHaveBeenCalledTimes(3);
    });


    it('should startInteraction', () => {
      expect(window.NewRelic.startInteraction() instanceof Promise).toBe(true);
      spyOn(window.NewRelic, "startInteraction");
      window.NewRelic.startInteraction('start interaction');
      expect(window.NewRelic.startInteraction).toHaveBeenCalledTimes(1);
    });

    it('should end method Interaction', () => {
      spyOn(window.NewRelic, "endInteraction");
      window.NewRelic.endInteraction('start interaction');
      expect(window.NewRelic.endInteraction).toHaveBeenCalledTimes(1);
    });

    it('should record JS error', () => {
      spyOn(window.NewRelic, "recordError");
      let exampleError = new TypeError;
      window.NewRelic.recordError(exampleError.name, exampleError.message, exampleError.stack, true);
      window.NewRelic.recordError('fakeErrorName', 'fakeMsg', 'fakeStack', false);
      expect(window.NewRelic.recordError).toHaveBeenCalledTimes(2);
    });

    it('should have currentSessionId', () => {
      expect(window.NewRelic.currentSessionId() instanceof Promise).toBe(true);
      spyOn(window.NewRelic, "currentSessionId");
      window.NewRelic.currentSessionId();
      expect(window.NewRelic.currentSessionId).toHaveBeenCalledTimes(1);
    });

    it('should incrementAttribute', () => {
      spyOn(window.NewRelic, "incrementAttribute");
      window.NewRelic.incrementAttribute('eventType');
      window.NewRelic.incrementAttribute('eventTypeWithValue', 100);
      expect(window.NewRelic.incrementAttribute).toHaveBeenCalledTimes(2);
    });

    it('should noticeNetworkFailure', () => {
      spyOn(window.NewRelic, "noticeNetworkFailure");
      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "GET", Date.now(), Date.now(), 'Unknown');
      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "POST", Date.now(), Date.now(), 'BadURL');
      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "GET", Date.now(), Date.now(), 'CannotConnectToHost');
      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "POST", Date.now(), Date.now(), 'DNSLookupFailed');
      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "GET", Date.now(), Date.now(), 'BadServerResponse');
      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "POST", Date.now(), Date.now(), 'SecureConnectionFailed');
      expect(window.NewRelic.noticeNetworkFailure).toHaveBeenCalledTimes(6);
    });

    it('should recordMetric', () => {
      spyOn(window.NewRelic, "recordMetric");
      window.NewRelic.recordMetric('fakeName', 'fakeCategory');
      window.NewRelic.recordMetric('fakeName', 'fakeCategory', 13);
      window.NewRelic.recordMetric('fakeName', 'fakeCategory', 21, 'PERCENT', 'SECONDS');
      expect(window.NewRelic.recordMetric).toHaveBeenCalledTimes(3);
    });

    it('should removeAllAttributes', () => {
      spyOn(window.NewRelic, "removeAllAttributes");
      window.NewRelic.removeAllAttributes();
      expect(window.NewRelic.removeAllAttributes).toHaveBeenCalledTimes(1);
    });

    it('should setMaxEventBufferTime', () => {
      spyOn(window.NewRelic, "setMaxEventBufferTime");
      window.NewRelic.setMaxEventBufferTime(120);
      expect(window.NewRelic.setMaxEventBufferTime).toHaveBeenCalledTimes(1);
    });

    it('should setMaxEventPoolSize', () => {
      spyOn(window.NewRelic, "setMaxEventPoolSize");
      window.NewRelic.setMaxEventPoolSize(2000);
      expect(window.NewRelic.setMaxEventPoolSize).toHaveBeenCalledTimes(1);
    });

    it('should set the analytics event flag', () => {
      spyOn(window.NewRelic, "analyticsEventEnabled");
      window.NewRelic.analyticsEventEnabled(true);
      window.NewRelic.analyticsEventEnabled(false);
      expect(window.NewRelic.analyticsEventEnabled).toHaveBeenCalledTimes(2);
    });
  
    it('should set the network request flag', () => {
      spyOn(window.NewRelic, "networkRequestEnabled");
      window.NewRelic.networkRequestEnabled(true);
      window.NewRelic.networkRequestEnabled(false);
      expect(window.NewRelic.networkRequestEnabled).toHaveBeenCalledTimes(2);
    });
  
    it('should set the network error request flag', () => {
      spyOn(window.NewRelic, "networkErrorRequestEnabled");
      window.NewRelic.networkErrorRequestEnabled(false);
      window.NewRelic.networkErrorRequestEnabled(true);
      expect(window.NewRelic.networkErrorRequestEnabled).toHaveBeenCalledTimes(2);
    });
  
    it('should set the http request body flag', () => {
      spyOn(window.NewRelic, "httpRequestBodyCaptureEnabled");
      window.NewRelic.httpRequestBodyCaptureEnabled(true);
      window.NewRelic.httpRequestBodyCaptureEnabled(false);
      expect(window.NewRelic.httpRequestBodyCaptureEnabled).toHaveBeenCalledTimes(2);
    });

  });
}