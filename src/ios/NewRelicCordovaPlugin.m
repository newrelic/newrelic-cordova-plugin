//  New Relic for Mobile -- iOS edition
//
//  See:
//    https://docs.newrelic.com/docs/releases/ios for release notes
//
//  Copyright (c) 2017 New Relic. All rights reserved.
//  See https://docs.newrelic.com/docs/licenses/ios-agent-licenses for license details
//

#import "NewRelicCordovaPlugin.h"

@interface NewRelic (Private)
  + (void) setPlatformVersion:(NSString*)version;
  + (NSDictionary*) keyAttributes;
@end

@implementation NewRelicCordovaPlugin

- (void)pluginInitialize {
  NSString* applicationToken = [self.commandDelegate.settings objectForKey:@"ios_app_token"];
  NSString* platformVersion =  [self.commandDelegate.settings objectForKey:@"plugin_version"];

  if (applicationToken == nil || ([applicationToken isEqualToString:@""] || [applicationToken isEqualToString:@"x"])) {
    NRLOG_ERROR(@"Failed to load application token! The iOS agent is not configured for Cordova.");
  } else {
    [NewRelic setPlatform:NRMAPlatform_Cordova];
    [NewRelic setPlatformVersion:platformVersion];
    [NewRelicAgent startWithApplicationToken:applicationToken];
  }
}

- (void) getNativeData:(CDVInvokedUrlCommand*)command {
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                  messageAsDictionary:[NewRelic keyAttributes]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
