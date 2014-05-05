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
        return done();
    });
    it('should validate the arguments properly', function (done) {
        function create (code) {
            return function () {
                return errors.createHTTPError(code);
            };
        }
        create().should.throw();
        create(200).should.throw();
        create('Not Found').should.not.throw();
        create('Not a Valid Error').should.throw();
        create(600).should.throw();
        create(404).should.not.throw();
        return done();
    });
    it('should extend the built-in Error type properly when called with new', function (done) {
        var Constructor = errors.createHTTPError(404);
        var error = new Constructor();
        error.should.be.instanceOf(Error);
        error.should.be.instanceOf(Constructor);
        Error.prototype.isPrototypeOf(error).should.equal(true);
        error.toString().should.be.equal('404 ' + http.STATUS_CODES[404]);
        error.should.have.property('message');
        error.should.not.have.enumerable('message');
        error.should.have.property('name');
        error.should.not.have.enumerable('name');
        return done();
    });
    it('should extend the built-in Error type properly when called bare', function (done) {
        var constructor = errors.createHTTPError(404);
        var error = constructor();
        error.should.be.instanceOf(Error);
        error.should.be.instanceOf(constructor);
        Error.prototype.isPrototypeOf(error).should.equal(true);
        error.toString().should.be.equal('404 ' + http.STATUS_CODES[404]);
        error.should.have.property('message');
        error.should.not.have.enumerable('message');
        error.should.have.property('name');
        error.should.not.have.enumerable('name');
        return done();
    });
    it('should have a proper stack trace', function (done) {
        var error = new errors.NotFoundError('Testing');
        error.should.have.property('stack');
        error.should.not.have.enumerable('stack');
        error.stack.should.containEql('test/index.js');
        return done();
    });
    it('should have a proper code property', function (done) {
        var error = new errors.NotFoundError('Testing');
        error.should.have.property('code');
        error.should.not.have.enumerable('code');
        error.code.should.be.equal(404);
        error.code.should.be.exactly(404);
        return done();
    });
    it('should have a proper status property', function (done) {
        var error = new errors.NotFoundError('Testing');
        error.should.have.property('status');
        error.should.not.have.enumerable('status');
        error.status.should.be.equal(http.STATUS_CODES[404]);
        return done();
    });
});
