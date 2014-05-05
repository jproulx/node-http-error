/*jshint node: true */
/*globals require, exports, console, Error */


"use strict";
var http = require('http');
/**
 * Create a custom error class based on an HTTP status code
 *
 * @public
 * @param   {Number}    code    The HTTP status code to derive the error message from
 * @return  {HTTPError}
 *
 * @example
 *     var errors = require('errors');
 *     throw new errors.NotFoundError('/missing');
 */
exports.createHTTPError = function createHTTPError (code) {
    function HTTPError (message) {
        // Check to see if this was called with the `new` operator
        if (this instanceof HTTPError) {
            var properties = {
                'name' : {
                    'value'        : [code, http.STATUS_CODES[code]].join(' '),
                    'enumerable'   : false,
                    'writable'     : true,
                    'configurable' : true
                },
                'code' : {
                    'value'        : Number(code),
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
            // Hence: `new Error(message)` is functionally equivalent to `Error(message)`;
            // What we can do instead is to set the common properties (name, message)
            // directly on this object as it is being constructed and mark them as non-enumerable.
            // We also set a few new properties based on the status code.
            var proxy = Error.apply(null, arguments);
            // Capture the stack trace and ignore the wrapper functions in the stack.
            // We capture this trace on the proxy object then copy it over later.
            Error.captureStackTrace(proxy, HTTPError);
            Object.getOwnPropertyNames(proxy).forEach(function (property) {
                properties[property] = Object.getOwnPropertyDescriptor(proxy, property);
            });
            Object.defineProperties(this, properties);
        // Otherwise assume it was called as a bare function and mimic the language shorthand
        } else {
            return new HTTPError(message);
        }
    }
    // Borrow from Node's `util.inherits` method, assign the correct prototype
    // and constructor to the new error class
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
/**
 * For each defined error code in the built-in list of statuses, create a corresponding error object
 * and export it
 */
Object.keys(http.STATUS_CODES).forEach(function (code, index, list) {
    if (code >= 400) {
        var name = http.STATUS_CODES[code].split(' ').join('').replace(/[^a-z]/gi, '') + 'Error';
        this[name] = this.createHTTPError(code);
    }
}.bind(exports));
