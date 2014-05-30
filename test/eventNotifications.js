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

  it("/my-profile/{id}/event-notifications should return an array of event notification", function(done){
    this.timeout(5000);
    attendee_id = '2';
    attributes = ["id","tco_id","name","start_time","end_time","location","type"];
   
    request.get(setup.testUrl + "/my-profile/"+attendee_id+"/event-notifications", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].should.have.keys(attributes);
      done();
    });
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
  
  it("/tcos/{tco_id}/events/{id}/notififcations should add a event notification", function(done){
    this.timeout(5000);
    tco_id = 'tco14';
    id = 1;
    
    request.post(setup.testUrl + "/tcos/"+tco_id+"/events/"+id+"/notififcations", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.response.rowCount.should.equal(1);
      done();
    });
  });
});
