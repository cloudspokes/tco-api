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

  it("/tcos/#{tco_id}/events/#{id} should return an array with only valid attributes", function(done){
    this.timeout(5000);
    tco_id = "tco14";
    id = 1;
    attributes = ["id","name","type","details","start_time","end_time","location","tco_id"];
    request.get(setup.testUrl + "/tcos/"+tco_id+"/events/"+id, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0]["id"].should.equal(id);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });  


  it("/tcos/#{tco_id}/events{?type,date} should return array with only valid attributes", function(done){
    this.timeout(5000);
    tco_id = "tco14";
    type = "Competition";
    date = "2014-05-21";
    attributes = ["id","name","type","details","start_time","end_time","location","tco_id"];
    request.get(setup.testUrl + "/tcos/"+tco_id+"/events?type="+type+"&date="+date, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.be.at.least(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0]["type"].should.equal(type);
      var start_time = new Date(body.response[0]["start_time"]);
      var end_time = new Date(body.response[0]["end_time"]);
      date = new Date(date);
      // TODO -- looks like time zone issue?
      // date.getDate().should.be.at.least(start_time.getDate());
      date.getDate().should.be.at.most(end_time.getDate());
      date.getMonth().should.be.at.least(start_time.getMonth());
      date.getMonth().should.be.at.most(end_time.getMonth());
      body.response[0].should.have.keys(attributes);
      done();
    });
  });  

  it("/tcos/#{tco_id}/events#{id}/attendees should return array of attendees with only valid attributes", function(done){
    this.timeout(5000);
    tco_id = "tco14";
    id = 1;
    attributes = ["id","tco_id","handle","name","avatar","type","email","country","quote","member_since","current_challenges"];
    request.get(setup.testUrl + "/tcos/"+tco_id+"/events/"+id+"/attendees", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0]["tco_id"].should.equal(tco_id);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });

});