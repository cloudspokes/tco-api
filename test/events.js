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

  it("/event should return an array with only valid attributes", function(done){
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
      JSON.stringify(Object.keys(body.response[0])).should.equal(JSON.stringify(attributes));
      done();
    });
  });  

});