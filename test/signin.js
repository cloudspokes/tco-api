var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('signin', function() {

  before(function(done) {
    setup.init(done);
  });

  after(function(done) {
    done();
  });

  /*
   * Tests POST /signin with correct credentials.
   */
  it("/signin should authenticate a user", function(done) {
    this.timeout(50000);
    request.post(setup.testUrl + "/tcos/tco14/signin",
      {
        form: {
          email: 'sample@tcosapi.com',
          password: 'sample'
        }
      }, function(err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.success.should.be.true;
        should.not.exist(body.msg);
        should.not.exist(err);
        done();
      });
  });

  /*
   * Tests POST /signin with wrong credentials.
   */
  it("/signin should not authenticate a user", function(done) {
    this.timeout(50000);
    request.post(setup.testUrl + "/tcos/tco14/signin",
      {
        form: {
          email: 'sample@tcosapi.com',
          password: 'WRONG PASSWORD'
        }
      }, function(err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(401);
        body.success.should.be.false;
        should.exist(body.msg);
        should.not.exist(err);
        done();
      });
  });

});