"use strict";
var http   = require('http');
var errors = require('./error');
describe('HTTP Errors', function () {
    it('should be a proper constructor', function (done) {
        var Constructor = errors.NotFoundError;
        var error = new errors.NotFoundError('/test');
        Constructor.should.be.type('function');
        Constructor.should.have.property('prototype');
        Constructor.prototype.should.be.type('object');
        Constructor.prototype.should.have.property('constructor');
        error.should.be.instanceOf(Error);
        error.should.be.instanceOf(TypeError);
        error.should.be.instanceOf(errors.HTTPError);
        return done();
    });
    it('should validate the arguments properly', function (done) {
        function create (code) {
            return function () {
                return errors.createHTTPError(code);
            };
        }
        create().should.throw(TypeError);
        create(200).should.throw(TypeError);
        create('Not Found').should.not.throw();
        create('Not a Valid Error').should.throw(TypeError);
        create('').should.throw(TypeError);
        create('200').should.throw(TypeError);
        create("404").should.not.throw();
        create(600).should.throw(TypeError);
        create(404).should.not.throw();
        return done();
    });
    it('should have a proper code property', function (done) {
        var error = new errors.NotFoundError('Testing');
        error.should.have.property('code');
        error.code.should.be.equal(404);
        error.code.should.be.exactly(404);
        return done();
    });
    it('should have a proper status property', function (done) {
        var error = new errors.NotFoundError('Testing');
        error.should.have.property('status');
        error.status.should.be.equal(http.STATUS_CODES[404]);
        return done();
    });
});
