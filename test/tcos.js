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

  /*
   * Tests Retrieve Album: GET /tcos/{tco_id}/albums/{id}
   */
  it("/tcos/{tco_id}/albums/{id} should return an album", function(done) {
    this.timeout(5000);
    attributes = [ 'id', 'tco_id', 'name', 'cover' ];
    tco_id = 'tco14';
    id = 1;
    request.get(setup.testUrl + "/tcos/" + tco_id + "/albums/" + id,
      function (err, res, body) {
        body = JSON.parse(body);
        console.log(body);
        res.statusCode.should.equal(200);
        body.count.should.equal(1);
        body.response.should.be.an.instanceof(Array);
        body.response[0].tco_id.should.equal(tco_id);
        body.response[0].id.should.equal(id);
        body.response[0].should.to.have.keys(attributes);
        done();
      }
    );
  });

});