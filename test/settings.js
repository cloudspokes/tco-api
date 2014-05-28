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

  it("/my-profile/settings should return two settings", function(done){
    this.timeout(5000);
    var attributes = ['event_push_notifications', 'allow_private_messages'];

    request.get(setup.testUrl + "/my-profile/settings/2", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });
});