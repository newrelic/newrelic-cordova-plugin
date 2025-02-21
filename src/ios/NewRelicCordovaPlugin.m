/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

#import "NewRelicCordovaPlugin.h"

@interface NewRelic (Private)
+ (void) setPlatformVersion:(NSString*)version;
@end

@implementation NewRelicCordovaPlugin {
    NSRegularExpression* jscRegex;
    NSRegularExpression* geckoRegex;
    NSRegularExpression* nodeRegex;
}


- (void)pluginInitialize
{
    NSString* applicationToken = [self.commandDelegate.settings objectForKey:@"ios_app_token"];
    
    NSDictionary* config = self.commandDelegate.settings;
    
    jscRegex = [NSRegularExpression regularExpressionWithPattern:@"^\\s*(?:([^@]*)(?:\\((.*?)\\))?@)?(\\S.*?):(\\d+)(?::(\\d+))?\\s*$"
                                                         options:NSRegularExpressionCaseInsensitive
                                                           error:nil];
    geckoRegex = [NSRegularExpression regularExpressionWithPattern:@"^\\s*(.*?)(?:\\((.*?)\\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\\[native).*?|[^@]*bundle)(?::(\\d+))?(?::(\\d+))?\\s*$"
                                                           options:NSRegularExpressionCaseInsensitive
                                                             error:nil];
    nodeRegex = [NSRegularExpression regularExpressionWithPattern:@"^\\s*at (?:((?:\\[object object\\])?[^\\/]+(?: \\[as \\S+\\])?) )?\\(?(.*?):(\\d+)(?::(\\d+))?\\)?\\s*$"
                                                          options:NSRegularExpressionCaseInsensitive
                                                            error:nil];
    
    if ([self isEmptyConfigParameter:applicationToken]) {
        NRLOG_ERROR(@"Failed to load application token! The iOS agent is not configured for Cordova.");
        
    } else {
        
        if ([self shouldDisableFeature:config[@"crash_reporting_enabled"]]) {
            [NewRelic disableFeatures:NRFeatureFlag_CrashReporting];
        }
        if ([self shouldDisableFeature:config[@"distributed_tracing_enabled"]]) {
            [NewRelic disableFeatures:NRFeatureFlag_DistributedTracing];
        }
        if ([self shouldDisableFeature:config[@"interaction_tracing_enabled"]]) {
            [NewRelic disableFeatures:NRFeatureFlag_InteractionTracing];
        }
        if ([self shouldDisableFeature:config[@"default_interactions_enabled"]]) {
            [NewRelic disableFeatures:NRFeatureFlag_DefaultInteractions];
        }
        if ([self shouldDisableFeature:config[@"web_view_instrumentation"]]) {
            [NewRelic disableFeatures:NRFeatureFlag_WebViewInstrumentation];
        }
        if (![self shouldDisableFeature:config[@"fedramp_enabled"]]) {
            [NewRelic enableFeatures:NRFeatureFlag_FedRampEnabled];
        }
        if (![self shouldDisableFeature:config[@"offline_storage_enabled"]]) {
            [NewRelic enableFeatures:NRFeatureFlag_OfflineStorage];
        }
        
        if (![self shouldDisableFeature:config[@"new_event_system_enabled"]]) {
            [NewRelic enableFeatures:NRFeatureFlag_NewEventSystem];
        }
        
        
        // Set log level depending on loggingEnabled and logLevel
        NRLogLevels logLevel = NRLogLevelWarning;
        NSDictionary *logDict = @{
            @"ERROR": [NSNumber numberWithInt:NRLogLevelError],
            @"WARNING": [NSNumber numberWithInt:NRLogLevelWarning],
            @"INFO": [NSNumber numberWithInt:NRLogLevelInfo],
            @"VERBOSE": [NSNumber numberWithInt:NRLogLevelVerbose],
            @"AUDIT": [NSNumber numberWithInt:NRLogLevelAudit],
        };
        if ([logDict objectForKey:[config[@"log_level"] uppercaseString]]) {
            NSString* configLogLevel = [config[@"log_level"] uppercaseString];
            NSNumber* newLogLevel = [logDict valueForKey:configLogLevel];
            logLevel = [newLogLevel intValue];
        }
        if ([self shouldDisableFeature:config[@"logging_enabled"]]) {
            logLevel = NRLogLevelNone;
        }
        [NRLogger setLogLevels:logLevel];
        
        
        NSString* collectorAddress = config[@"collector_address"];
        NSString* crashCollectorAddress = config[@"crash_collector_address"];
        
        [NewRelic setPlatform:NRMAPlatform_Cordova];
        [NewRelic setPlatformVersion:config[@"plugin_version"]];
        
        
        if ([self isEmptyConfigParameter:collectorAddress] && [self isEmptyConfigParameter:crashCollectorAddress]) {
            [NewRelic startWithApplicationToken:applicationToken];
        } else {
            // Set to default collector endpoints if only one of two addresses was set
            if ([self isEmptyConfigParameter:collectorAddress]) {
                collectorAddress = @"mobile-collector.newrelic.com";
            }
            if ([self isEmptyConfigParameter:crashCollectorAddress]) {
                crashCollectorAddress = @"mobile-crash.newrelic.com";
            }
            
            [NewRelic startWithApplicationToken:applicationToken
                            andCollectorAddress:collectorAddress
                       andCrashCollectorAddress:crashCollectorAddress];
        }
    }
}

- (BOOL)isEmptyConfigParameter:(NSString *)param {
    return param == nil || ([param isEqualToString:@""] || [param isEqualToString:@"x"]);
}

- (BOOL)shouldDisableFeature:(NSString *)flag {
    return [[flag lowercaseString] isEqualToString:@"false"];
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

- (void)recordLogs:(CDVInvokedUrlCommand *)command {
    NSDictionary* config = self.commandDelegate.settings;
    if (![self shouldDisableFeature:config[@"console_logs_enabled"]]) {
        
        NSString* eventType = [command.arguments objectAtIndex:0];
        NSString* eventName = [command.arguments objectAtIndex:1];
        NSDictionary *attributes = [command.arguments objectAtIndex:2];
        
        [NewRelic recordCustomEvent:eventType name:eventName attributes:attributes];
    }
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

- (NSMutableArray*)parseStackTrace:(NSString*)stackString {
    NSArray* lines = [stackString componentsSeparatedByString:@"\n"];
    NSMutableArray* stackFramesArr = [NSMutableArray new];
    NSRange stringRange;
    
    for(NSString* line in lines){
        NSArray* result;
        stringRange = NSMakeRange(0, [line length]);
        if ([[jscRegex matchesInString:line options:0 range:stringRange] firstObject] != nil) {
            result = [jscRegex matchesInString:line options:0 range:stringRange];
        } else if ([[geckoRegex matchesInString:line options:0 range:stringRange] firstObject] != nil) {
            result = [geckoRegex matchesInString:line options:0 range:stringRange];
        } else if ([[nodeRegex matchesInString:line options:0 range:stringRange] firstObject] != nil) {
            result = [nodeRegex matchesInString:line options:0 range:stringRange];
        } else {
            continue;
        }
        
        NSMutableDictionary* stackTraceElement = [NSMutableDictionary new];
        NSRange methodRange = [result[0] rangeAtIndex:1];
        NSRange fileRange = [result[0] rangeAtIndex:3];
        NSRange lineNumRange = [result[0] rangeAtIndex:4];
        
        stackTraceElement[@"method"] = methodRange.length == 0 ? @" " : [line substringWithRange:methodRange];
        stackTraceElement[@"file"] = fileRange.length == 0 ? @" " : [line substringWithRange:fileRange];
        stackTraceElement[@"line"] = lineNumRange.length == 0 ? [NSNumber numberWithInt:1] : @([[line substringWithRange:lineNumRange] intValue]);
        
        [stackFramesArr addObject:stackTraceElement];
    }
    
    return stackFramesArr;
}

- (void)recordError:(CDVInvokedUrlCommand *)command {
    NSString* errorName = [command.arguments objectAtIndex:0];
    NSString* errorMessage = [command.arguments objectAtIndex:1];
    NSString* errorStack = [command.arguments objectAtIndex:2];
    NSString* isFatal = @"false";
    NSDictionary* errorAttributes = [command.arguments objectAtIndex:4];
    
    if ([[command.arguments objectAtIndex:3] boolValue] == YES) {
        isFatal = @"true";
    }
    
    NSMutableDictionary* attributes = [NSMutableDictionary new];
    attributes[@"name"] = errorName;
    attributes[@"cause"] = errorMessage;
    attributes[@"reason"] = errorMessage;
    attributes[@"fatal"] = isFatal;
    if (errorAttributes != nil && ![errorAttributes isKindOfClass:[NSNull class]]) {
        for(id key in errorAttributes) {
            attributes[key] = errorAttributes[key];
        }
    }
    
    NSMutableArray* stackTraceArr = [self parseStackTrace:errorStack];
    attributes[@"stackTraceElements"] = stackTraceArr;
    
    @try {
        [NewRelic recordHandledExceptionWithStackTrace:attributes];
    } @catch (NSException* exception){
        NSLog(@"%@", exception.reason);
        NSDictionary *dict =  @{@"Name":errorName,@"Message": errorMessage, @"errorStack": errorStack,@"isFatal": isFatal};
        [NewRelic recordBreadcrumb:@"JS Errors" attributes:dict];
        [NewRelic recordCustomEvent:@"JS Errors" attributes:dict];
    }
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
    
    NSDictionary* params;
    if([command.arguments objectAtIndex:8] == [NSNull null] ){
        params = nil;
    }
    else {params = [command.arguments objectAtIndex:8];
    }
    
    NSDictionary* traceAttributes;
    if([command.arguments objectAtIndex:9] == [NSNull null] ){
        traceAttributes = nil;
    }
    else {
        traceAttributes = [command.arguments objectAtIndex:9];
    }
    
    NSURL *nsurl = [NSURL URLWithString:url];
    NSData* data;
    if (body == [NSNull null]) {
        data = nil;
    } else {
        data = [body dataUsingEncoding:NSUTF8StringEncoding];
    }
    
    [NewRelic noticeNetworkRequestForURL:nsurl httpMethod:method startTime:[startTime doubleValue] endTime:[endTime doubleValue] responseHeaders:nil statusCode:(long)[status integerValue] bytesSent:(long)[bytesSent integerValue] bytesReceived:(long)[bytesreceived integerValue] responseData:data traceHeaders:traceAttributes andParams:params];
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

- (void)setMaxOfflineStorageSize:(CDVInvokedUrlCommand *)command {
    NSNumber* megaBytes = [command.arguments objectAtIndex:0];
    unsigned int uint_megaBytes = megaBytes.unsignedIntValue;
    [NewRelic setMaxOfflineStorageSize:uint_megaBytes];
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

- (void)shutdown:(CDVInvokedUrlCommand *)command {
    [NewRelic shutdown];
}

- (void)addHTTPHeadersTrackingFor:(CDVInvokedUrlCommand *) command{
    NSArray* headers = [command.arguments objectAtIndex:0];
    [NewRelic addHTTPHeaderTrackingFor:headers];
    
}

- (void)getHTTPHeadersTrackingFor:(CDVInvokedUrlCommand *) command{
    
    CDVPluginResult* pluginResult = nil;
    NSArray<NSString*>* headers =  [NewRelic httpHeadersAddedForTracking];
    
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:headers options:NSJSONWritingPrettyPrinted error:&error];
    NSString *jsonString = @"[]";
    if (!jsonData) {
        NSLog(@"Got an error: %@", error);
    } else {
        jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSLog(@"%@", jsonString);
    }
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: @{@"headersList": jsonString}];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}

- (void)getConsoleLogFeatureFlag:(CDVInvokedUrlCommand *) command{
    NSDictionary* config = self.commandDelegate.settings;
    CDVPluginResult* pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: @{@"consoleLogEnabled": config[@"console_logs_enabled"]}];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}

- (void)generateDistributedTracingHeaders:(CDVInvokedUrlCommand *)command {
    
    CDVPluginResult* pluginResult = nil;
    
    NSDictionary<NSString*,NSString*>* headers =  [NewRelic generateDistributedTracingHeaders];
    
    NSMutableDictionary *mutableDictionary = [headers mutableCopy];

    NSData *decodedData = [[NSData alloc] initWithBase64EncodedString:headers[@"newrelic"] options:0];
          
    NSError *error = nil;
    NSDictionary *jsonObject = [NSJSONSerialization JSONObjectWithData:decodedData options:0 error:&error];

          if (error) {
              NSLog(@"Error parsing JSON: %@", error);
          } else {
              NSLog(@"JSON Object: %@", jsonObject);
              // Access individual values from the JSON object
              NSDictionary *dDictionary = jsonObject[@"d"];
              NSString *acNumber = dDictionary[@"ac"];
              NSString *apNumber = dDictionary[@"ap"];
              NSString *tkNumber = dDictionary[@"tk"];

              
              
              [mutableDictionary setObject:acNumber forKey:@"application.id"];
              [mutableDictionary setObject:apNumber forKey:@"account.id"];
              
              if(tkNumber != nil) {
                  [mutableDictionary setObject:tkNumber forKey:@"trust.account.key"];
              } else {
                  [mutableDictionary setObject:acNumber forKey:@"trust.account.key"];
              }
          }
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:mutableDictionary];
        
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}
- (void)logInfo:(CDVInvokedUrlCommand *)command {
    NSString* message = [command.arguments objectAtIndex:0];
    [NewRelic logInfo:message];
    
}

- (void)logError:(CDVInvokedUrlCommand *)command {
    NSString* message = [command.arguments objectAtIndex:0];
    [NewRelic logError:message];
}

- (void)logWarn:(CDVInvokedUrlCommand *)command {
    NSString* message = [command.arguments objectAtIndex:0];
    [NewRelic logWarning:message];
}

- (void)logDebug:(CDVInvokedUrlCommand *)command {
    NSString* message = [command.arguments objectAtIndex:0];
    [NewRelic logDebug:message];
}

- (void)logVerbose:(CDVInvokedUrlCommand *)command {
    NSString* message = [command.arguments objectAtIndex:0];
    [NewRelic logVerbose:message];
}

- (void)log:(CDVInvokedUrlCommand *)command {
    NSString* level =  [command.arguments objectAtIndex:0];
    NSString* message = [command.arguments objectAtIndex:1];
    
    if(message == nil || message.length == 0) {
        return;
    }
    
    if(level == nil || level.length == 0) {
        return;
    }
    
    NRLogLevels logLevel = NRLogLevelWarning;
    NSDictionary *logDict = @{
        @"ERROR": [NSNumber numberWithInt:NRLogLevelError],
        @"WARNING": [NSNumber numberWithInt:NRLogLevelWarning],
        @"INFO": [NSNumber numberWithInt:NRLogLevelInfo],
        @"VERBOSE": [NSNumber numberWithInt:NRLogLevelVerbose],
        @"AUDIT": [NSNumber numberWithInt:NRLogLevelAudit],
    };
    if ([logDict objectForKey:[level uppercaseString]]) {
        NSString* configLogLevel = [level uppercaseString];
        NSNumber* newLogLevel = [logDict valueForKey:configLogLevel];
        logLevel = [newLogLevel intValue];
    }
    
    [NewRelic log:message level:logLevel];
}

- (void)logAttributes:(CDVInvokedUrlCommand *)command {
    NSDictionary *attributes = [command.arguments objectAtIndex:0];
    
    [NewRelic logAttributes :attributes];
    
}

- (void)logAll:(CDVInvokedUrlCommand *)command {
    
    NSString* message = [command.arguments objectAtIndex:0];
    NSDictionary *attributes = [command.arguments objectAtIndex:1];
    
    NSMutableDictionary *mutableDictionary = [attributes mutableCopy];     //Make the dictionary mutable to change/add
    
    mutableDictionary[@"message"] = message;
    
    [NewRelic logAttributes:mutableDictionary];
}

@end
