var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('tcos', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  it("/tcos should return an array", function(done){
    this.timeout(5000);
    request.get(setup.testUrl + "/tcos", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(2);
      body.response.should.be.an.instanceOf(Array);
      done();
    });
  });

  it("/tcos/#{id} should return a single tco array", function(done){
    this.timeout(5000);
    attributes = ["id","city","end_date","start_date","state","name","location","zip","website"];
    id = 'tco14';
    request.get(setup.testUrl + "/tcos/"+id, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].id.should.equal(id);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });    

});