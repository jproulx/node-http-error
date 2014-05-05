/*jshint node: true */
/*globals require, exports, console, Error */
"use strict";
var http = require('http');
exports.createHTTPError = function createHTTPError (code) {
    function HTTPError (message) {
        Error.captureStackTrace(this, HTTPError);
        Object.defineProperties(this, {
            'message' : {
                'value'        : message || 'Error',
                'enumerable'   : false,
                'writable'     : true,
                'configurable' : true
            },
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
        });
    }
    HTTPError.prototype = Object.create(Error.prototype, {
        'constructor' : {
            'value' : HTTPError,
            'enumerable'   : false,
            'writable'     : true,
            'configurable' : true
        }
    });
    return HTTPError;
};
Object.keys(http.STATUS_CODES).forEach(function (code, index, list) {
    if (code >= 400) {
        var name = http.STATUS_CODES[code].split(' ').join('').replace(/[^a-z]/gi, '') + 'Error';
        this[name] = this.createHTTPError(code);
    }
}.bind(this));
