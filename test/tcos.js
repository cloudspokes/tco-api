var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('tcos', function(){

  var timeoutInterval = 10000;

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  it("/tcos should return an array", function(done){
    this.timeout(timeoutInterval);
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
    this.timeout(timeoutInterval);
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

  /*
   * Tests Retrieve News: GET /tcos/{tco_id}/news/{id}
   */
  it("/tcos/{tco_id}/news/{id} should return a news object", function(done) {
    this.timeout(timeoutInterval);
    attributes = [ 'id', 'tco_id', 'name', 'source_url',
                   'source', 'creation_date', 'content' ];
    tco_id = 'tco14';
    id = 1;
    request.get(setup.testUrl + "/tcos/" + tco_id + "/news/" + id,
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

  /*
   * Tests Retrieve Sponsor: GET /tcos/{tco_id}/sponsor/{id}
   */
  it("/tcos/{tco_id}/sponsor/{id} should return a sponsor object", function(done) {
    this.timeout(timeoutInterval);
    attributes = [ 'id', 'tco_id', 'name', 'level',
                   'logo_url', 'video_url', 'description' ];
    tco_id = 'tco14';
    id = 1;
    request.get(setup.testUrl + "/tcos/" + tco_id + "/sponsor/" + id,
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
        console.log(body);
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