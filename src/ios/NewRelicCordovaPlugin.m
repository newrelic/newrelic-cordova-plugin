/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0 
 */

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

-  (void)endInteraction:(CDVInvokedUrlCommand *)command {

    CDVPluginResult* pluginResult = nil;
    NSString* actionName = [command.arguments objectAtIndex:0];
    [NewRelic stopCurrentInteraction:actionName];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
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

- (void)crashNow:(CDVInvokedUrlCommand *)command {
    NSString* message = [command.arguments objectAtIndex:0];
    if ([message length] == 0) {
        [NewRelic crashNow];
    } else {
        [NewRelic crashNow:message];
    }
}

- (void)currentSessionId:(CDVInvokedUrlCommand *)command {
    NSString* sessionId = [NewRelic currentSessionId];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:sessionId];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)incrementAttribute:(CDVInvokedUrlCommand *)command {
    NSString* name = [command.arguments objectAtIndex:0];
    NSNumber* value = [command.arguments objectAtIndex:1];
    [NewRelic incrementAttribute:name value:value];
}

- (void)noticeNetworkFailure:(CDVInvokedUrlCommand *)command {
    NSString* url = [command.arguments objectAtIndex:0];
    NSString* httpMethod = [command.arguments objectAtIndex:1];
    NSNumber* startTime = [command.arguments objectAtIndex:2];
    NSNumber* endTime = [command.arguments objectAtIndex:3];
    NSString* failure = [command.arguments objectAtIndex:4];
    
    NSURL *nsurl = [NSURL URLWithString:url];
    
    NSDictionary *dict = @{
            @"Unknown": [NSNumber numberWithInt:NRURLErrorUnknown],
            @"BadURL": [NSNumber numberWithInt:NRURLErrorBadURL],
            @"TimedOut": [NSNumber numberWithInt:NRURLErrorTimedOut],
            @"CannotConnectToHost": [NSNumber numberWithInt:NRURLErrorCannotConnectToHost],
            @"DNSLookupFailed": [NSNumber numberWithInt:NRURLErrorDNSLookupFailed],
            @"BadServerResponse": [NSNumber numberWithInt:NRURLErrorBadServerResponse],
            @"SecureConnectionFailed": [NSNumber numberWithInt:NRURLErrorSecureConnectionFailed],
        };
    NSInteger iOSFailureCode = [[dict valueForKey:failure] integerValue];
    [NewRelic noticeNetworkFailureForURL:nsurl httpMethod:httpMethod startTime:[startTime doubleValue] endTime:[endTime doubleValue] andFailureCode:iOSFailureCode];
}

- (void)recordMetric:(CDVInvokedUrlCommand *)command {
    NSString* name = [command.arguments objectAtIndex:0];
    NSString* category = [command.arguments objectAtIndex:1];
    NSNumber* value = [command.arguments objectAtIndex:2];
    NSString* countUnit = [command.arguments objectAtIndex:3];
    NSString* valueUnit = [command.arguments objectAtIndex:4];
    
    int intval = (value.intValue);
    
    NSDictionary *dict = @{
        @"PERCENT": kNRMetricUnitPercent,
        @"BYTES": kNRMetricUnitBytes,
        @"SECONDS": kNRMetricUnitSeconds,
        @"BYTES_PER_SECOND": kNRMetricUnitsBytesPerSecond,
        @"OPERATIONS": kNRMetricUnitsOperations
    };
    
    if (intval < 0) {
        [NewRelic recordMetricWithName:name category:category];
    } else {
        
        if (countUnit == nil || valueUnit == nil || [countUnit isKindOfClass:[NSNull class]] || [valueUnit isKindOfClass:[NSNull class]]) {
            [NewRelic recordMetricWithName:name category:category value:value];
        } else {
            [NewRelic recordMetricWithName:name category:category value:value valueUnits:dict[valueUnit] countUnits:dict[countUnit]];
        }
    }
}

- (void)removeAllAttributes:(CDVInvokedUrlCommand *)command {
    [NewRelic removeAllAttributes];
}

- (void)setMaxEventBufferTime:(CDVInvokedUrlCommand *)command {
    NSNumber* maxBufferTimeInSeconds = [command.arguments objectAtIndex:0];
    unsigned int uint_seconds = maxBufferTimeInSeconds.unsignedIntValue;
    [NewRelic setMaxEventBufferTime:uint_seconds];
}

- (void)setMaxEventPoolSize:(CDVInvokedUrlCommand *)command {
    NSNumber* maxPoolSize = [command.arguments objectAtIndex:0];
    unsigned int uint_maxPoolSize = maxPoolSize.unsignedIntValue;
    [NewRelic setMaxEventPoolSize:uint_maxPoolSize];
}

- (void)analyticsEventEnabled:(CDVInvokedUrlCommand *)command {
    // This should only be an android method call, so we do nothing here.
    return;
}

- (void)networkRequestEnabled:(CDVInvokedUrlCommand *)command {
    if([[command.arguments objectAtIndex:0] boolValue] == YES) {
        [NewRelic enableFeatures:NRFeatureFlag_NetworkRequestEvents];
    } else {
        [NewRelic disableFeatures:NRFeatureFlag_NetworkRequestEvents];
    }
}

- (void)networkErrorRequestEnabled:(CDVInvokedUrlCommand *)command {
    if([[command.arguments objectAtIndex:0] boolValue] == YES) {
        [NewRelic enableFeatures:NRFeatureFlag_RequestErrorEvents];
    } else {
        [NewRelic disableFeatures:NRFeatureFlag_RequestErrorEvents];
    }
}

- (void)httpRequestBodyCaptureEnabled:(CDVInvokedUrlCommand *)command {
    if([[command.arguments objectAtIndex:0] boolValue] == YES) {
        [NewRelic enableFeatures:NRFeatureFlag_HttpResponseBodyCapture];
    } else {
        [NewRelic disableFeatures:NRFeatureFlag_HttpResponseBodyCapture];
    }
}

@end
