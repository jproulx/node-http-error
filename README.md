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
function authorize (req, res, next) {
    if (// not authorized logic) {
        return next(new HTTPErrors.ForbiddenError('Please log in'));
    }
    return next();
});
app.get('/sensitive', authorize, function (req, res, next) {
    return res.render('logged_in');
});
app.use(function (req, res, next) {
    throw new HTTPErrors.NotFoundError(req.url);
});
```
Additionally, each error type is exposed as its own Error constructor:

* `HTTPErrors.BadRequestError(message);`
* `HTTPErrors.UnauthorizedError(message);`
* `HTTPErrors.PaymentRequiredError(message);`
* `HTTPErrors.ForbiddenError(message);`
* `HTTPErrors.NotFoundError(message);`
* `HTTPErrors.MethodNotAllowedError(message);`
* `HTTPErrors.NotAcceptableError(message);`
* `HTTPErrors.ProxyAuthenticationRequiredError(message);`
* `HTTPErrors.RequestTimeoutError(message);`
* `HTTPErrors.ConflictError(message);`
* `HTTPErrors.GoneError(message);`
* `HTTPErrors.LengthRequiredError(message);`
* `HTTPErrors.PreconditionFailedError(message);`
* `HTTPErrors.RequestEntityTooLargeError(message);`
* `HTTPErrors.RequestURITooLargeError(message);`
* `HTTPErrors.UnsupportedMediaTypeError(message);`
* `HTTPErrors.RequestedRangeNotSatisfiableError(message);`
* `HTTPErrors.ExpectationFailedError(message);`
* `HTTPErrors.ImATeapotError(message);`
* `HTTPErrors.UnprocessableEntityError(message);`
* `HTTPErrors.LockedError(message);`
* `HTTPErrors.FailedDependencyError(message);`
* `HTTPErrors.UnorderedCollectionError(message);`
* `HTTPErrors.UpgradeRequiredError(message);`
* `HTTPErrors.PreconditionRequiredError(message);`
* `HTTPErrors.TooManyRequestsError(message);`
* `HTTPErrors.RequestHeaderFieldsTooLargeError(message);`
* `HTTPErrors.InternalServerError(message);`
* `HTTPErrors.NotImplementedError(message);`
* `HTTPErrors.BadGatewayError(message);`
* `HTTPErrors.ServiceUnavailableError(message);`
* `HTTPErrors.GatewayTimeoutError(message);`
* `HTTPErrors.HTTPVersionNotSupportedError(message);`
* `HTTPErrors.VariantAlsoNegotiatesError(message);`
* `HTTPErrors.InsufficientStorageError(message);`
* `HTTPErrors.BandwidthLimitExceededError(message);`
* `HTTPErrors.NotExtendedError(message);`
* `HTTPErrors.NetworkAuthenticationRequiredError(message);`

## Source
Annotated source code is available at http://jproulx.github.io/node-http-error

## Notes
Care is taken to preserve the built-in error handling behavior as much as possible, with support for checking `instanceof` and `typeof`, as well as making sure the error constructor behaves the same whether it is called with the `new` operator or not.

In other words, you shouldn't have to worry about these errors affecting your syntax or existing code. Simply drop in place for any existing errors you're throwing and it should work just the same.
