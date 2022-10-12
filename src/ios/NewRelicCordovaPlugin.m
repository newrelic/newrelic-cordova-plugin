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
@end

@implementation NewRelicCordovaPlugin


- (void)pluginInitialize
{
    NSString* applicationToken = [self.commandDelegate.settings objectForKey:@"ios_app_token"];
    NSString* platformVersion =  [self.commandDelegate.settings objectForKey:@"plugin_version"];
    
    if (applicationToken == nil || ([applicationToken isEqualToString:@""] || [applicationToken isEqualToString:@"x"])) {
        NRLOG_ERROR(@"Failed to load application token! The iOS agent is not configured for Cordova.");
        
    } else {
        [NewRelic setPlatform:NRMAPlatform_Cordova];
        [NewRelic setPlatformVersion:platformVersion];
        [NewRelic startWithApplicationToken:applicationToken];
    }
}
- (void)recordBreadCrumb:(CDVInvokedUrlCommand *)command {
    NSString* name = [command.arguments objectAtIndex:0];
    NSDictionary *attributes = [command.arguments objectAtIndex:1];
    
    [NewRelic recordBreadcrumb:name attributes:attributes];
}

- (void)recordCustomEvent:(CDVInvokedUrlCommand *)command {
    NSString* eventType = [command.arguments objectAtIndex:0];
    NSString* eventName = [command.arguments objectAtIndex:1];
    NSDictionary *attributes = [command.arguments objectAtIndex:2];

    [NewRelic recordCustomEvent:eventType name:eventName attributes:attributes];
}

- (void)setAttribute:(CDVInvokedUrlCommand *)command {
    NSString* name = [command.arguments objectAtIndex:0];
    NSString* value = [command.arguments objectAtIndex:1];
    
    [NewRelic setAttribute:name value:value];
}

- (void)removeAttribute:(CDVInvokedUrlCommand *)command {
    NSString* name = [command.arguments objectAtIndex:0];
    [NewRelic removeAttribute:name];
}

- (void)setUserId:(CDVInvokedUrlCommand *)command {
    NSString* userId = [command.arguments objectAtIndex:0];
    [NewRelic setUserId:userId];
}

-  (void)startInteraction:(CDVInvokedUrlCommand *)command {
    
    CDVPluginResult* pluginResult = nil;
    NSString* actionName = [command.arguments objectAtIndex:0];
    NSString* interactionId = [NewRelic startInteractionWithName:(NSString * _Null_unspecified)actionName];
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:interactionId];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)endInteraction:(CDVInvokedUrlCommand *)command {
    NSString* interActionId = [command.arguments objectAtIndex:0];
    [NewRelic stopCurrentInteraction:interActionId];
}

- (void)recordError:(CDVInvokedUrlCommand *)command {
    NSString* errorName = [command.arguments objectAtIndex:0];
    NSString* errorMessage = [command.arguments objectAtIndex:1];
    NSString* errorStack = [command.arguments objectAtIndex:2];
    NSString* isFatal = @"false";

    if ([[command.arguments objectAtIndex:3] boolValue] == YES) {
        isFatal = @"true";
    }
    
    NSDictionary *dict =  @{@"Name":errorName,@"Message": errorMessage, @"errorStack": errorStack,@"isFatal": isFatal};
        [NewRelic recordBreadcrumb:@"JS Errors" attributes:dict];
        [NewRelic recordCustomEvent:@"JS Errors" attributes:dict];

}

- (void)noticeDistributedTrace:(CDVInvokedUrlCommand *)command {
    
    CDVPluginResult* pluginResult = nil;

    NSDictionary<NSString*,NSString*>* headers =  [NewRelic generateDistributedTracingHeaders];
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:headers];
     
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}

- (void)noticeHttpTransaction:(CDVInvokedUrlCommand *)command {
    NSString* url = [command.arguments objectAtIndex:0];
    NSString* method = [command.arguments objectAtIndex:1];
    NSNumber* status = [command.arguments objectAtIndex:2 ] ;
    NSNumber* startTime = [command.arguments objectAtIndex:3];
    NSNumber* endTime = [command.arguments objectAtIndex:4];
    NSNumber* bytesSent = [command.arguments objectAtIndex:5];
    NSNumber* bytesreceived = [command.arguments objectAtIndex:6];
    NSString* body = [command.arguments objectAtIndex:7];
    

    NSURL *nsurl = [NSURL URLWithString:url];
    NSData* data = [body dataUsingEncoding:NSUTF8StringEncoding];

   [NewRelic noticeNetworkRequestForURL:nsurl httpMethod:method startTime:[startTime doubleValue] endTime:[endTime doubleValue] responseHeaders:nil statusCode:(long)[status integerValue] bytesSent:(long)[bytesSent integerValue] bytesReceived:(long)[bytesreceived integerValue] responseData:data traceHeaders:nil andParams:nil];
}

@end
