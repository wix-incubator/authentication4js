# Wix Restaurants Authentication JavaScript Client
[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url]

This client library is used to authenticate with the **Wix Restaurants API**.

### Usage
Install the library with `npm install authentication4js`

```javascript
var AuthenticationClient = require('authentication4js').Authentication;

var authenticationClient = new AuthenticationClient({
  XMLHttpRequest: window.XMLHttpRequest
});

// Authenticate with Wix instance
authenticationClient.wix({
  instance: 'some-wix-instance',
  appKey: 'some-wix-app-key'
}).then(function(loginResponse) {
  console.log(loginResponse.user);
  console.log(loginResponse.accessToken);
});

// Authenticate with Google
authenticationClient.google({
  clientId: 'some-client-id',
  idToken: 'some-id-token'
}).then(function(loginResponse) {
  console.log(loginResponse.user);
  console.log(loginResponse.accessToken);
});
```

[downloads-image]: https://img.shields.io/npm/dm/authentication4js.svg

[npm-url]: https://npmjs.org/package/authentication4js
[npm-image]: https://img.shields.io/npm/v/authentication4js.svg

## Reporting Issues

Please use [the issue tracker](https://github.com/wix/authentication4js/issues) to report issues related to this library.

## License
This library uses the Apache License, version 2.0.
