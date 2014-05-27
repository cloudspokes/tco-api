var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('events', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  /*
   * Tests Event like checker: GET /tcos/{tco_id}/events/{id}/like
   *
   * Expects the event to be liked.
   */
  it("/tcos/{tco_id}/events/{id}/like should return event is liked.", function(done) {
    this.timeout(5000);
    request.get(setup.testUrl + "/tcos/tco14/events/1/like",
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.count, null);
        body.response.should.be.an.instanceof(Object);
        body.response.liked.should.be.true;
        done();
      }
    );
  });

  /*
   * Tests Event like checker: GET /tcos/{tco_id}/event/{id}/like
   *
   * Expects the event to not be liked.
   */
  it("/tcos/{tco_id}/events/{id}/like should return event not liked.", function(done) {
    this.timeout(5000);
    request.get(setup.testUrl + "/tcos/tco14/events/5/like",
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.count, null);
        body.response.should.be.an.instanceof(Object);
        body.response.liked.should.be.false;
        done();
      }
    );
  });

});