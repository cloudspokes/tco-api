var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('messages', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  it("/tcos/#{tco_id}/messages/ should return an array of messages with only valid attributes", function(done){
    this.timeout(5000);
    tco_id = "tco14";
    attributes = ["id","tco_id","subject","from_attendee","from_attendee_name","to_attendee","to_attendee_name","creation_date","status","attachment"];
    request.get(setup.testUrl + "/tcos/"+tco_id+"/messages/", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(2);
      body.response.should.be.an.instanceOf(Array);
      body.response[0]["tco_id"].should.equal(tco_id);
      body.response[1]["tco_id"].should.equal(tco_id);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });  


  it("/tcos/#{tco_id}/messages{?from,to} should return array with only valid attributes", function(done){
    this.timeout(5000);
    tco_id = "tco14";
    from = 1;
    to = 2;
    attributes = ["id","tco_id","subject","from_attendee","from_attendee_name","to_attendee","to_attendee_name","creation_date","status","attachment"];
    request.get(setup.testUrl + "/tcos/"+tco_id+"/messages?from="+from+"&to="+to, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0]["tco_id"].should.equal(tco_id);
      body.response[0]["from_attendee"].should.equal(from);
      body.response[0]["to_attendee"].should.equal(to);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });  

  it("/tcos/#{tco_id}/messages{?from} should return array with only valid attributes", function(done){
    this.timeout(5000);
    tco_id = "tco14";
    from = 1;
    attributes = ["id","tco_id","subject","from_attendee","from_attendee_name","to_attendee","to_attendee_name","creation_date","status","attachment"];
    request.get(setup.testUrl + "/tcos/"+tco_id+"/messages?from="+from, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0]["tco_id"].should.equal(tco_id);
      body.response[0]["from_attendee"].should.equal(from);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });  

  it("/tcos/#{tco_id}/messages{?to} should return array with only valid attributes", function(done){
    this.timeout(5000);
    tco_id = "tco14";
    to = 1;
    attributes = ["id","tco_id","subject","from_attendee","from_attendee_name","to_attendee","to_attendee_name","creation_date","status","attachment"];
    request.get(setup.testUrl + "/tcos/"+tco_id+"/messages?to="+to, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0]["tco_id"].should.equal(tco_id);
      body.response[0]["to_attendee"].should.equal(to);
      body.response[0].should.have.keys(attributes);
      done();
    });
  }); 

  it("/tcos/#{tco_id}/messages{?from,to} should NOT return values", function(done){
    this.timeout(15000);
    tco_id = "tco14";
    from = 1;
    to = 1;
    attributes = ["id","tco_id","subject","from_attendee","from_attendee_name","to_attendee","to_attendee_name","creation_date","status","attachment"];
    request.get(setup.testUrl + "/tcos/"+tco_id+"/messages?from="+from+"&to="+to, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(0);
      body.response.should.be.an.instanceOf(Array);
      done();
    });
  }); 

});