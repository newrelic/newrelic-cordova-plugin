# Guidelines for Contributing Code

At New Relic we welcome community code contributions our open source project,
and have taken effort to make this process easy for both contributors and our
development team. Because of this, we need to be more defensive in our coding
practices than most projects.

## Testing
### Functional Testing
The plugin includes a suite of functional tests which should be used to
verify your changes don't break existing functionality.

Functional tests are stored in the `test` directory.

Running the test suite is simple.  Just invoke:
```
    npm install
    npm test
```

This will run the tests in standalone mode, executing the test suite.
### Unit Testing
The plugin includes unit testing that is stored in the `tests` directory. 

Our testing makes use of [cordova-paramedic](https://github.com/apache/cordova-paramedic) to run our tests in a test app in an emulator. The npm version of cordova-paramedic is out of date, so it is preferred to install it using GitHub. To install it, run:
```
    npm install -g github:apache/cordova-paramedic
```
Once it is installed, you will be able to run tests for each individual platform.
```
    npm run test:android
    npm run test:ios
```
If you run into issues on iOS side, you might have to restart your emulator. 


### Writing Tests

For most contributions it is strongly recommended to add additional tests which
exercise your changes.

This helps us efficiently incorporate your changes into our mainline codebase
and provides a safeguard that your change won't be broken by future development.

There are some rare cases where code changes do not result in changed
functionality (e.g. a performance optimization) and new tests are not required.
In general, including tests with your pull request dramatically increases the
chances it will be accepted.

### And Finally...

You are welcome to send pull requests to us - however, by doing so you agree that you are granting New Relic a non-exclusive, non-revokable, no-cost license to use the code, algorithms, patents, and ideas in that code in our products if we so choose. You also agree the code is provided as-is and you provide no warranties as to its fitness or correctness for any purpose.
