"use strict";
var http        = require('http');
var assert      = require('assert');
var customError = require('custom-error-generator');
var reverse     = {};
var names       = {};
exports.HTTPError = customError('HTTPError', {}, TypeError);
/**
 * Create a custom error class based on an HTTP status code
 *
 * @function createHTTPError
 * @public
 * @param   {Number|String}     code    The HTTP status code to derive the error message from
 * @param   {String}            name    Optional name for Error class
 * @return  {HTTPStatusError}
 *
 * @example
 *     var HTTPErrors = require('errors');
 *     throw new HTTPErrors.NotFoundError('/missing');
 */
exports.createHTTPError = function createHTTPError (code, name) {
    // Attempt to look up the code from the reverse map
    if (typeof code == 'string' && isNaN(parseInt(code, 10))) {
        code = reverse[code];
    }
    // Validate status code
    code = parseInt(code, 10);
    if (isNaN(code)) {
        throw new TypeError('Code needs to be a valid number');
    }
    if (code < 400) {
        throw new TypeError('Code needs to be a valid error status');
    }
    if (!http.STATUS_CODES[code]) {
        throw new TypeError('Status code does not exist');
    }
    if (!name) {
        name = names[code];
    }
    return customError(name, {
        'code'   : code,
        'status' : http.STATUS_CODES[code]
    }, exports.HTTPError);
};
// For each defined error code in the built-in list of statuses, create a
// corresponding error shortcut and export it
Object.keys(http.STATUS_CODES).forEach(function (code, index, list) {
    if (code >= 400) {
        var name = http.STATUS_CODES[code].replace(/( [a-z])/g, function ($1) { return $1.toUpperCase(); }).replace(/Error$/, '').replace(/[^a-z]/gi, '') + 'Error';
        names[code] = name;
        reverse[http.STATUS_CODES[code]] = code;
        this[name] = this.createHTTPError(code, name);
    }
}.bind(exports));
