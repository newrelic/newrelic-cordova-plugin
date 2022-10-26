const { expect } = require("chai");

exports.defineAutoTests = () => {
  describe('New Relic Cordova Plugin', () => {

    beforeEach(() => {
    });
    
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
      spyOn(window.NewRelic, "noticeHttpTransaction").and.callThrough();
      window.NewRelic.noticeHttpTransaction("https://fakeurl.com", "GET", 200, Date.now(), Date.now(), 1000, 0);
      window.NewRelic.noticeHttpTransaction("https://fakeurl.com", "POST", 404, Date.now(), Date.now(), 1000, 0, "fake body");
      expect(window.NewRelic.noticeHttpTransaction).toHaveBeenCalledTimes(2);
    });

    it('should set userId', () => {
      spyOn(window.NewRelic, "setUserId").and.callThrough();
      window.NewRelic.setUserId("fakeId")
      expect(window.NewRelic.setUserId).toHaveBeenCalledTimes(1);
    });

    it('should set attribute', () => {
      spyOn(window.NewRelic, "setAttribute").and.callThrough();
      spyOn(cordova, "exec").and.callThrough();

      window.NewRelic.setAttribute('eventType', 123);
      window.NewRelic.setAttribute('eventType', true);
      window.NewRelic.setAttribute('eventType', 'eventName');
      window.NewRelic.setAttribute('eventType', false);

      // Bad arguments
      window.NewRelic.setAttribute(null, null);
      window.NewRelic.setAttribute(null, 'yes');
      window.NewRelic.setAttribute('yes', null);
      window.NewRelic.setAttribute(123, null);
      window.NewRelic.setAttribute(true, null);
      window.NewRelic.setAttribute('true', undefined);
      window.NewRelic.setAttribute('', undefined);

      expect(cordova.exec).toHaveBeenCalledTimes(4);
      expect(window.NewRelic.setAttribute).toHaveBeenCalledTimes(11);
    });

    it('should remove attribute', () => {
      spyOn(window.NewRelic, "removeAttribute").and.callThrough();
      window.NewRelic.removeAttribute('eventType');
      expect(window.NewRelic.removeAttribute).toHaveBeenCalledTimes(1);
    });

    it('should record breadcrumb', () => {
      spyOn(window.NewRelic, "recordBreadcrumb").and.callThrough();
      spyOn(cordova, "exec").and.callThrough();

      window.NewRelic.recordBreadcrumb('testName', { test: 123, valid: 'yes' });
      window.NewRelic.recordBreadcrumb(null, { test: 123, valid: 'no' });

      expect(cordova.exec).toHaveBeenCalledTimes(1);
      expect(window.NewRelic.recordBreadcrumb).toHaveBeenCalledTimes(2);
    });

    it('should record custom event', () => {
      spyOn(window.NewRelic, "recordCustomEvent").and.callThrough();
      spyOn(cordova.exec).and.callThrough();

      window.NewRelic.recordCustomEvent('eventType', 'eventName', { test: 123, valid: 'yes' });
      window.NewRelic.recordCustomEvent('eventType', '', { test: 123, valid: 'yes' });
      window.NewRelic.recordCustomEvent('eventType', undefined, { test: 123, valid: 'yes' });

      // Bad arguments
      window.NewRelic.recordCustomEvent('eventType', null, { test: 123, valid: 'yes' });
      window.NewRelic.recordCustomEvent('eventType', [], { test: 123, valid: 'yes' });
      window.NewRelic.recordCustomEvent('eventType', {}, { test: 123, valid: 'yes' });

      expect(cordova.exec).toHaveBeenCalledTimes(3);
      expect(window.NewRelic.recordCustomEvent).toHaveBeenCalledTimes(6);
    });


    it('should startInteraction', () => {
      expect(window.NewRelic.startInteraction() instanceof Promise).toBe(true);
      spyOn(window.NewRelic, "startInteraction").and.callThrough();
      window.NewRelic.startInteraction('start interaction');
      expect(window.NewRelic.startInteraction).toHaveBeenCalledTimes(1);
    });

    it('should end method Interaction', () => {
      spyOn(window.NewRelic, "endInteraction").and.callThrough();
      window.NewRelic.endInteraction('start interaction');
      expect(window.NewRelic.endInteraction).toHaveBeenCalledTimes(1);
    });

    it('should record JS error', () => {
      spyOn(window.NewRelic, "recordError").and.callThrough();
      spyOn(cordova, "exec").and.callThrough();

      let exampleError = new TypeError;
      window.NewRelic.recordError(exampleError.name, exampleError.message, exampleError.stack, true);
      window.NewRelic.recordError('fakeErrorName', 'fakeMsg', 'fakeStack', false);

      // Bad arguments
      window.NewRelic.recordError(null, 'fakeMsg', 'fakeStack', false);
      window.NewRelic.recordError('fakeErrorName', null, 'fakeStack', true);

      expect(cordova.exec).toHaveBeenCalledTimes(2);
      expect(window.NewRelic.recordError).toHaveBeenCalledTimes(4);
    });

    it('should have currentSessionId', () => {
      expect(window.NewRelic.currentSessionId() instanceof Promise).toBe(true);
      spyOn(window.NewRelic, "currentSessionId").and.callThrough();
      window.NewRelic.currentSessionId();
      expect(window.NewRelic.currentSessionId).toHaveBeenCalledTimes(1);
    });

    it('should incrementAttribute', () => {
      spyOn(window.NewRelic, "incrementAttribute").and.callThrough();

      window.NewRelic.incrementAttribute('eventType');
      window.NewRelic.incrementAttribute('eventTypeWithValue', 100);
      expect(window.NewRelic.incrementAttribute).toHaveBeenCalledTimes(2);
    });

    it('should noticeNetworkFailure', () => {
      spyOn(window.NewRelic, "noticeNetworkFailure").and.callThrough();
      spyOn(cordova, "exec").and.callThrough();

      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "GET", Date.now(), Date.now(), 'Unknown');
      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "POST", Date.now(), Date.now(), 'BadURL');
      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "GET", Date.now(), Date.now(), 'CannotConnectToHost');
      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "POST", Date.now(), Date.now(), 'DNSLookupFailed');
      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "GET", Date.now(), Date.now(), 'BadServerResponse');
      window.NewRelic.noticeNetworkFailure("https://newrelic.com", "POST", Date.now(), Date.now(), 'SecureConnectionFailed');

      // With Bad Arguments
      NewRelic.noticeNetworkFailure("https://newrelic.com", "GET", Date.now(), Date.now(), '404');
      NewRelic.noticeNetworkFailure("https://newrelic.com", "GET", Date.now(), Date.now(), 'randomname');

      expect(cordova.exec).toHaveBeenCalledTimes(6);
      expect(window.NewRelic.noticeNetworkFailure).toHaveBeenCalledTimes(8);
    });

    it('should recordMetric', () => {
      spyOn(window.NewRelic, "recordMetric").and.callThrough();
      spyOn(cordova, "exec").and.callThrough();
      spyOn(window.console, "error");

      window.NewRelic.recordMetric('fakeName', 'fakeCategory');
      window.NewRelic.recordMetric('fakeName', 'fakeCategory', 13);
      window.NewRelic.recordMetric('fakeName', 'fakeCategory', 21, 'PERCENT', 'SECONDS');

      // With Bad Arguments
      window.NewRelic.recordMetric('fakeName', 'fakeCategory', 2, 'SECONDS');
      window.NewRelic.recordMetric('fakeName', 'fakeCategory', -1, 'SECONDS', 'PERCENT');
      window.NewRelic.recordMetric('fakeName', 'fakeCategory', 10, null, 'BYTES_PER_SECOND');
      window.NewRelic.recordMetric('fakeName', 'fakeCategory', 3, 'MINUTES', 'SECONDS');
      window.NewRelic.recordMetric('fakeName', 'fakeCategory', 3, 'PERCENT', 'HOURS');
      window.NewRelic.recordMetric('fakeName', 'fakeCategory', 3, 'DAYS', 'HOURS');

      expect(cordova.exec).toHaveBeenCalledTimes(3);
      expect(window.NewRelic.recordMetric).toHaveBeenCalledTimes(9);
    });

    it('should removeAllAttributes', () => {
      spyOn(window.NewRelic, "removeAllAttributes").and.callThrough();
      window.NewRelic.removeAllAttributes();
      expect(window.NewRelic.removeAllAttributes).toHaveBeenCalledTimes(1);
    });

    it('should setMaxEventBufferTime', () => {
      spyOn(window.NewRelic, "setMaxEventBufferTime").and.callThrough();
      window.NewRelic.setMaxEventBufferTime(120);
      expect(window.NewRelic.setMaxEventBufferTime).toHaveBeenCalledTimes(1);
    });

    it('should setMaxEventPoolSize', () => {
      spyOn(window.NewRelic, "setMaxEventPoolSize").and.callThrough();
      window.NewRelic.setMaxEventPoolSize(2000);
      expect(window.NewRelic.setMaxEventPoolSize).toHaveBeenCalledTimes(1);
    });

    it('should set the analytics event flag', () => {
      spyOn(window.NewRelic, "analyticsEventEnabled").and.callThrough();
      window.NewRelic.analyticsEventEnabled(true);
      window.NewRelic.analyticsEventEnabled(false);
      expect(window.NewRelic.analyticsEventEnabled).toHaveBeenCalledTimes(2);
    });
  
    it('should set the network request flag', () => {
      spyOn(window.NewRelic, "networkRequestEnabled").and.callThrough();
      window.NewRelic.networkRequestEnabled(true);
      window.NewRelic.networkRequestEnabled(false);
      expect(window.NewRelic.networkRequestEnabled).toHaveBeenCalledTimes(2);
    });
  
    it('should set the network error request flag', () => {
      spyOn(window.NewRelic, "networkErrorRequestEnabled").and.callThrough();
      window.NewRelic.networkErrorRequestEnabled(false);
      window.NewRelic.networkErrorRequestEnabled(true);
      expect(window.NewRelic.networkErrorRequestEnabled).toHaveBeenCalledTimes(2);
    });
  
    it('should set the http request body flag', () => {
      spyOn(window.NewRelic, "httpRequestBodyCaptureEnabled").and.callThrough();
      window.NewRelic.httpRequestBodyCaptureEnabled(true);
      window.NewRelic.httpRequestBodyCaptureEnabled(false);
      expect(window.NewRelic.httpRequestBodyCaptureEnabled).toHaveBeenCalledTimes(2);
    });

  });
}