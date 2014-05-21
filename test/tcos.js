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
    request.get(setup.testUrl + "/tcos", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(2);
      body.response.should.be.an.instanceOf(Array)
      done();
    });
  });  

});