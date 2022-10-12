//  New Relic for Mobile -- iOS edition
//
//  See:
//    https://docs.newrelic.com/docs/mobile-apps for information
//    https://docs.newrelic.com/docs/releases/ios for release notes
//
//  Copyright (c) 2014 New Relic. All rights reserved.
//  See https://docs.newrelic.com/docs/licenses/ios-agent-licenses for license details
//

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


@end
