/*jshint node: true */
/*global require, describe, it */
'use strict';
var http   = require('http');
var should = require('should');
var errors = require('../');
describe('HTTP Errors', function () {
    it('should be a proper constructor', function (done) {
        var Constructor = errors.NotFoundError;
        Constructor.should.be.type('function');
        Constructor.should.have.property('prototype');
        Constructor.prototype.should.be.type('object');
        Constructor.prototype.should.have.property('constructor');
        done();
    });
    it('should extend the built-in Error type properly', function (done) {
        var Constructor = errors.NotFoundError;
        var error = new Constructor('Testing');
        error.should.be.instanceOf(Error);
        error.should.be.instanceOf(Constructor);
        Error.prototype.isPrototypeOf(error).should.equal(true);
        error.toString().should.be.equal([
            '404 ',
            http.STATUS_CODES[404],
            ': Testing'
        ].join(''));
        error.should.have.property('message');
        error.should.not.have.enumerable('message');
        error.message.should.equal('Testing');
        done();
    });
    it('should have a proper stack trace', function (done) {
        var error = new errors.NotFoundError('Testing');
        error.should.have.property('stack');
        error.should.not.have.enumerable('stack');
        error.stack.should.containEql('test/index.js');
        done();
    });
    it('should have a proper code property', function (done) {
        var error = new errors.NotFoundError('Testing');
        error.should.have.property('code');
        error.should.not.have.enumerable('code');
        error.code.should.be.equal(404);
        error.code.should.be.exactly(404);
        done();
    });
    it('should have a proper status property', function (done) {
        var error = new errors.NotFoundError('Testing');
        error.should.have.property('status');
        error.should.not.have.enumerable('status');
        error.status.should.be.equal(http.STATUS_CODES[404]);
        done();
    });
});
