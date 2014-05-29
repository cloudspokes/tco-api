var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('eventNotifications', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  it("/my-profile/{id}/event-notifications/count should return a count of event notifications", function(done){
    this.timeout(5000);
    attendee_id = '2';
    
    request.get(setup.testUrl + "/my-profile/"+attendee_id+"/event-notifications/count", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].count.should.equal("1");
      done();
    });
  });
});