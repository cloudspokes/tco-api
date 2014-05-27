var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('sponsors', function(){

  var timeoutInterval = 10000;

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  /*
   * Tests Retrieve Sponsor: GET /tcos/{tco_id}/sponsor/{id}
   */
  it("/tcos/{tco_id}/sponsors/{id} should return a sponsor object", function(done) {
    this.timeout(timeoutInterval);
    attributes = [ 'id', 'tco_id', 'name', 'level',
                   'logo_url', 'video_url', 'description' ];
    tco_id = 'tco14';
    id = 1;
    request.get(setup.testUrl + "/tcos/" + tco_id + "/sponsors/" + id,
      function (err, res, body) {
        body = JSON.parse(body);
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

  /*
   * Tests list all Sponsors: GET /tcos/{tco_id}/sponsors
   */
  it("/tcos/{tco_id}/sponsors should return all sponsors", function(done) {
    this.timeout(timeoutInterval);
    attributes = [ 'id', 'tco_id', 'name', 'level',
                   'logo_url', 'video_url', 'description' ];
    tco_id = 'tco14'
    request.get(setup.testUrl + "/tcos/" + tco_id + "/sponsors",
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.count.should.equal(2);
        body.response.should.be.an.instanceof(Array);
        for (var i = 0; i < body.count; ++i) {
          body.response[i].tco_id.should.equal(tco_id);
          body.response[i].should.to.have.keys(attributes);
        }
        done();
      }
    );
  });

});