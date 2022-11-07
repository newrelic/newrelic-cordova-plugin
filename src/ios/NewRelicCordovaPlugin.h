/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

#import <Foundation/Foundation.h>
#import <NewRelic/NewRelic.h>
#import <Cordova/CDV.h>

@interface NewRelicCordovaPlugin : CDVPlugin {
    
}

- (void)recordBreadCrumb:(CDVInvokedUrlCommand *)command;

- (void)recordCustomEvent:(CDVInvokedUrlCommand *)command;

- (void)setAttribute:(CDVInvokedUrlCommand *)command;

- (void)removeAttribute:(CDVInvokedUrlCommand *)command;

- (void)setUserId:(CDVInvokedUrlCommand *)command;

- (void)startInteraction:(CDVInvokedUrlCommand *)command;

- (void)endInteraction:(CDVInvokedUrlCommand *)command;

- (void)noticeDistributedTrace:(CDVInvokedUrlCommand *)command;

- (void)noticeHttpTransaction:(CDVInvokedUrlCommand *)command;

- (void)recordError:(CDVInvokedUrlCommand *)command;

- (void)crashNow:(CDVInvokedUrlCommand *)command;

- (void)currentSessionId:(CDVInvokedUrlCommand *)command;

- (void)incrementAttribute:(CDVInvokedUrlCommand *)command;

- (void)noticeNetworkFailure:(CDVInvokedUrlCommand *)command;

- (void)recordMetric:(CDVInvokedUrlCommand *)command;

- (void)removeAllAttributes:(CDVInvokedUrlCommand *)command;

- (void)setMaxEventBufferTime:(CDVInvokedUrlCommand *)command;

- (void)setMaxEventPoolSize:(CDVInvokedUrlCommand *)command;

- (void)analyticsEventEnabled:(CDVInvokedUrlCommand *) command;

- (void)networkRequestEnabled:(CDVInvokedUrlCommand *) command;

- (void)networkErrorRequestEnabled:(CDVInvokedUrlCommand *) command;

- (void)httpRequestBodyCaptureEnabled:(CDVInvokedUrlCommand *) command;

@end
