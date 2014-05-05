http-custom-errors
==================
[![Build Status](https://travis-ci.org/jproulx/node-http-error.svg?branch=master)](https://travis-ci.org/jproulx/node-http-error)

Custom error classes based on HTTP statuses, designed to emulate the language specifications for Error types as best as possible.

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

## Notes
Care is taken to preserve the built-in error handling behavior as much as possible, with support for checking `instanceof` and `typeof`, as well as making sure the error constructor behaves the same whether it is called with the `new` operator or not.

In other words, you shouldn't have to worry about these errors affecting your syntax or existing code. Simply drop in place for any existing errors you're throwing and it should work just the same.