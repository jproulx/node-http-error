/*jshint node: true */
/*globals require, exports, console, Error */

// ## HTTPError
// The HTTPError class extends the built-in Error object, and has the following custom members:

// `code` The numeric HTTP status code

// `status` The HTTP status string

"use strict";
var http    = require('http');
var assert  = require('assert');
var reverse = {};
/**
 * Create a custom error class based on an HTTP status code
 *
 * @function createHTTPError
 * @public
 * @param   {Number|String}     code    The HTTP status code to derive the error message from
 * @return  {HTTPError}
 *
 * @example
 *     var HTTPErrors = require('errors');
 *     throw new HTTPErrors.NotFoundError('/missing');
 */
exports.createHTTPError = function createHTTPError (code) {
    // Attempt to look up the code from the reverse map
    if (typeof code == 'string' && isNaN(parseInt(code, 10))) {
        code = reverse[code];
    }
    // Validate status code
    code = parseInt(code, 10);
    assert(!isNaN(code), 'Code needs to be a valid Number');
    assert(code >= 400, 'Code needs to be a valid error status');
    assert(typeof http.STATUS_CODES[code] == 'string', 'Code does not exist');


    // Create our constructor function specific to this status code
    function HTTPError (message) {
        // If the constructor was called with the `new` operator, set up a custom object
        // closely resembling a built-in `Error`
        if (this instanceof HTTPError) {
            // Setup the initial custom properties
            var properties = {
                'name' : {
                    'value'        : [code, http.STATUS_CODES[code]].join(' '),
                    'enumerable'   : false,
                    'writable'     : true,
                    'configurable' : true
                },
                'code' : {
                    'value'        : code,
                    'enumerable'   : false,
                    'writable'     : true,
                    'configurable' : true
                },
                'status' : {
                    'value'        : http.STATUS_CODES[code],
                    'enumerable'   : false,
                    'writable'     : true,
                    'configurable' : true
                }
            };
            // A preferred method for inheriting a class in Javascript
            // is to call its constructor within the subclass with the same arguments.
            // However, when Error is called as a function rather than as a constructor,
            // it creates and initialises a new Error object instead, as a language shortcut.
            // Hence: `new Error(message);` is functionally equivalent to `Error(message);`

            // What we can do instead is to create a proxy error object,
            var proxy = Error.apply(null, arguments);

            // capture the stack trace at the appropriate stack location,
            Error.captureStackTrace(proxy, this.constructor);

            // then iterate over the proxy error properties and assign them to our custom
            // error object.
            Object.getOwnPropertyNames(proxy).forEach(function (property) {
                properties[property] = Object.getOwnPropertyDescriptor(proxy, property);
            });
            Object.defineProperties(this, properties);

        // If this constructor was called without the `new` operator, simply
        // mimic the language shorthand and return a new error
        } else {
            return new HTTPError(message);
        }
    }
    // Borrow from Node's `util.inherits` method, assign the correct prototype
    // and constructor to the new error class. We do not require the _super property here.
    HTTPError.prototype = Object.create(Error.prototype, {
        'constructor' : {
            'value'        : HTTPError,
            'enumerable'   : false,
            'writable'     : true,
            'configurable' : true
        }
    });
    return HTTPError;
};
// For each defined error code in the built-in list of statuses, create a
// corresponding error shortcut and export it
Object.keys(http.STATUS_CODES).forEach(function (code, index, list) {
    reverse[http.STATUS_CODES[code]] = code;
    if (code >= 400) {
        var name = http.STATUS_CODES[code].replace(/( [a-z])/g, function ($1) { return $1.toUpperCase(); }).replace(/Error$/, '').replace(/[^a-z]/gi, '') + 'Error';
        this[name] = this.createHTTPError(code);
    }
}.bind(exports));
