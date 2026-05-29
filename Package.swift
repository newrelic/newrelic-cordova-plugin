// swift-tools-version:5.9
/*
 * Copyright (c) 2022-present New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import PackageDescription

let package = Package(
    name: "newrelic-cordova-plugin",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "newrelic-cordova-plugin",
            targets: ["NewRelicCordovaPlugin"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/apache/cordova-ios.git", from: "8.0.0"),
        .package(url: "https://github.com/newrelic/newrelic-ios-agent-spm", exact: "7.7.2")
    ],
    targets: [
        .target(
            name: "NewRelicCordovaPlugin",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "NewRelic", package: "newrelic-ios-agent-spm")
            ],
            path: "src/ios",
            publicHeadersPath: "."
        )
    ]
)
