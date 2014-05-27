var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('attendees', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  /*
   * Tests Attendee liked checker: GET /tcos/{tco_id}/attendee/{id}/like
   *
   * Expects the attendee to be liked.
   */
  it("/tcos/{tco_id}/attendee/{id}/like should return attendee liked.", function(done) {
    this.timeout(5000);
    request.get(setup.testUrl + "/tcos/tco14/attendees/1/like",
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
   * Tests Attendee liked checker: GET /tcos/{tco_id}/attendees/{id}/like
   *
   * Expects the attendee to not be liked.
   */
  it("/tcos/{tco_id}/attendees/{id}/like should return attendee not liked.", function(done) {
    this.timeout(5000);
    request.get(setup.testUrl + "/tcos/tco14/attendees/5/like",
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