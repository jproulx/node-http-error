/*jshint node: true */
/*globals require, exports, console, Error */

// ## HTTPError
// The HTTPError class extends the built-in Error object, and has the following custom members:

// `code` The numeric HTTP status code

// `status` The HTTP status string

"use strict";
var http        = require('http');
var assert      = require('assert');
var customError = require('custom-error-generator');
var reverse     = {};
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
    var name = [code, http.STATUS_CODES[code]].join(' ');
    return customError(name, {
        'code'   : code,
        'status' : http.STATUS_CODES[code]
    });
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
