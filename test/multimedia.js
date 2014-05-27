var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('multimedia', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  /*
   * Tests Retrieve Multimedia:
   *
   *    GET /tcos/{tco_id}/albums/{album_id}/multimedia/{id}
   */
  it("/tcos/{tco_id}/albums/{album_id}/multimedia/{id} should return" +
  		" a multimedia object", function(done) {
    this.timeout(5000);
    attributes = [ 'id', 'tco_id', 'album_id', 'name', 'url' ];
    tco_id = 'tco14';
    album_id = 1;
    id = 2;
    testUrl = setup.testUrl + "/tcos/" + tco_id +
      "/albums/" + album_id + "/multimedia/" + id;
    request.get(testUrl, function (err, res, body) {
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceof(Array);
      body.response[0].tco_id.should.equal(tco_id);
      body.response[0].album_id.should.equal(album_id);
      body.response[0].id.should.equal(id);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });

  /*
   * Tests list all multimedia objects:
   *
   *    GET /tcos/{tco_id}/albums/{album_id}/multimedia
   */
  it("/tcos/{tco_id}/albums/{album_id}/multimedia should return" +
  		" all multimedia", function(done) {
    this.timeout(5000);
    attributes = [ 'id', 'tco_id', 'album_id', 'name', 'url' ];
    tco_id = 'tco14';
    album_id = 1;
    testUrl = setup.testUrl + "/tcos/" + tco_id +
      "/albums/" + album_id + "/multimedia";
    request.get(testUrl, function (err, res, body) {
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(2);
      body.response.should.be.an.instanceof(Array);
      for (var i = 0; i < body.count; ++i) {
        body.response[i].tco_id.should.equal(tco_id);
        body.response[i].should.to.have.keys(attributes);
      }
      done();
    });
  });

});