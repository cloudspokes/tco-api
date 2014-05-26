var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('albums', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
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
        body.response[0].should.have.keys(attributes);
        done();
      }
    );
  });

  /*
   * Tests List Albums: GET /tcos/{tco_id}/albums
   */
  it("/tcos/{tco_id}/albums should return a list of albums.", function(done) {
    this.timeout(5000);
    attributes = [ 'id', 'tco_id', 'name', 'cover' ];
    tco_id = 'tco14';
    request.get(setup.testUrl + "/tcos/" + tco_id + "/albums",
      function (err, res, body) {
        body = JSON.parse(body);
        console.log(body);
        res.statusCode.should.equal(200);
        body.count.should.equal(3);
        body.response.should.be.an.instanceof(Array);
        for (var i = 0; i < body.count; ++i) {
          body.response[i].tco_id.should.equal(tco_id);
          body.response[i].should.have.keys(attributes);
        }
        done();
      }
    );
  });

});