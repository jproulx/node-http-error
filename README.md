http-custom-errors
==================
[![Build Status](https://travis-ci.org/jproulx/node-http-error.svg?branch=master)](https://travis-ci.org/jproulx/node-http-error)

Custom error classes based on HTTP statuses, designed to emulate the language specifications for Error exceptions as best as possible.
## Install
```bash
npm install http-custom-errors
```
## Usage
```js
var HTTPErrors = require('http-custom-errors');
var error = createHTTPError(500); // Create a "500 Internal Server Error" exception
throw new HTTPErrors.NotFoundError('/missing'); // Throw a "404 Not Found Error" exception
```
The `createHTTPError(code);` function export will inherit and return a new error exception, with the additional `code` and `status` fields that correspond to the HTTP Server Statuses advertised by node's internal HTTP module.

One practical use would allow you to use a polymorphic error handler with `express.js`:
```js
app.use(function (err, res, req, next) {
  res.status(err.code || 500);
  // respond with html page
  if (req.accepts('html')) {
    return res.render(err.code || 500, { url: req.url });
  }
  // respond with json
  if (req.accepts('json')) {
    res.send({ 'message' : err.message || 'Server Error' });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send(err.message || 'Server Error');
});
```
With this middleware you would be able to simply throw the appropriate HTTP status error in the right situation:
```js
app.use(function (req, res, next) {
    throw new HTTPErrors.NotFoundError(req.url);
});
function authorize (req, res, next) {
    if (// not authorized logic) {
        return next(new HTTPErrors.ForbiddenError('Please log in'));
    }
    return next();
});
app.get('/sensitive', authorize, function (req, res, next) {
    return res.render('logged_in');
});
```
Additionally, each error type is exposed as its own Error constructor, the following are available:

* ```BadRequestError(code);```
* ```UnauthorizedError(code);```
* ```PaymentRequiredError(code);```
* ```ForbiddenError(code);```
* ```NotFoundError(code);```
* ```MethodNotAllowedError(code);```
* ```NotAcceptableError(code);```
* ```ProxyAuthenticationRequiredError(code);```
* ```RequestTimeoutError(code);```
* ```ConflictError(code);```
* ```GoneError(code);```
* ```LengthRequiredError(code);```
* ```PreconditionFailedError(code);```
* ```RequestEntityTooLargeError(code);```
* ```RequestURITooLargeError(code);```
* ```UnsupportedMediaTypeError(code);```
* ```RequestedRangeNotSatisfiableError(code);```
* ```ExpectationFailedError(code);```
* ```ImateapotError(code);```
* ```UnprocessableEntityError(code);```
* ```LockedError(code);```
* ```FailedDependencyError(code);```
* ```UnorderedCollectionError(code);```
* ```UpgradeRequiredError(code);```
* ```PreconditionRequiredError(code);```
* ```TooManyRequestsError(code);```
* ```RequestHeaderFieldsTooLargeError(code);```
* ```InternalServerError(code);```
* ```NotImplementedError(code);```
* ```BadGatewayError(code);```
* ```ServiceUnavailableError(code);```
* ```GatewayTimeoutError(code);```
* ```HTTPVersionNotSupportedError(code);```
* ```VariantAlsoNegotiatesError(code);```
* ```InsufficientStorageError(code);```
* ```BandwidthLimitExceededError(code);```
* ```NotExtendedError(code);```
* ```NetworkAuthenticationRequiredError(code);```

## Source
Annotated source code is available at http://jproulx.github.io/node-http-error

## Notes
Care is taken to preserve the built-in error handling behavior as much as possible, with support for checking `instanceof` and `typeof`, as well as making sure the error constructor behaves the same whether it is called with the `new` operator or not.

In other words, you shouldn't have to worry about these errors affecting your syntax or existing code. Simply drop in place for any existing errors you're throwing and it should work just the same.
