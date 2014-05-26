var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('favorites', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    done();
  });

  /*
   * Tests list favorite albums with no sort option:
   *
   *    GET /tcos/{tco_id}/favorite-albums?{sort}
   */
  it("/tcos/{tco_id}/favorite-albums?{sort} should return" +
      " a list of favorite albums.", function(done) {
    this.timeout(5000);
    attributes = [ 'likes', 'album' ];
    album_attributes = [ 'id', 'name', 'cover', 'tco_id' ];
    tco_id = 'tco14';
    testUrl = setup.testUrl + "/tcos/" + tco_id + "/favorite-albums";
    request.get(testUrl, function (err, res, body) {
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(2);
      body.response.should.be.an.instanceof(Array);
      body.response[0].should.have.keys(attributes);
      body.response[0].album.should.have.keys(album_attributes);
      body.response[0].album.tco_id.should.equal(tco_id);

      body.response[1].should.have.keys(attributes);
      body.response[1].album.should.have.keys(album_attributes);
      body.response[1].album.tco_id.should.equal(tco_id);
      done();
    });
  });

  /*
   * Tests list favorite albums with ascending order:
   *
   *    GET /tcos/{tco_id}/favorite-albums?{sort}
   */
  it("/tcos/{tco_id}/favorite-albums?{sort} should return" +
      " a list of favorite albums sorted ascendingly.", function(done) {
    this.timeout(5000);
    attributes = [ 'likes', 'album' ];
    album_attributes = [ 'id', 'name', 'cover', 'tco_id' ];
    tco_id = 'tco14';
    testUrl = setup.testUrl + "/tcos/" + tco_id + "/favorite-albums?sort=asc";
    request.get(testUrl, function (err, res, body) {
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(2);
      body.response.should.be.an.instanceof(Array);
      body.response[0].should.have.keys(attributes);
      body.response[0].likes.should.equal(1);

      body.response[0].album.should.have.keys(album_attributes);
      body.response[0].album.tco_id.should.equal(tco_id);

      body.response[1].should.have.keys(attributes);
      body.response[1].likes.should.equal(2);

      body.response[1].album.should.have.keys(album_attributes);
      body.response[1].album.tco_id.should.equal(tco_id);
      done();
    });
  });

  /*
   * Tests list favorite albums with descending order:
   *
   *    GET /tcos/{tco_id}/favorite-albums?{sort}
   */
  it("/tcos/{tco_id}/favorite-albums?{sort} should return" +
      " a list of favorite albums sorted descendingly.", function(done) {
    this.timeout(5000);
    var attributes = [ 'likes', 'album' ];
    var album_attributes = [ 'id', 'name', 'cover', 'tco_id' ];
    var tco_id = 'tco14';
    var testUrl = setup.testUrl + "/tcos/" + tco_id + "/favorite-albums?sort=desc";
    request.get(testUrl, function (err, res, body) {
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(2);
      body.response.should.be.an.instanceof(Array);
      body.response[0].should.have.keys(attributes);
      body.response[0].likes.should.equal(2);

      body.response[0].album.should.have.keys(album_attributes);
      body.response[0].album.tco_id.should.equal(tco_id);

      body.response[1].should.have.keys(attributes);
      body.response[1].likes.should.equal(1);

      body.response[1].album.should.have.keys(album_attributes);
      body.response[1].album.tco_id.should.equal(tco_id);

      done();
    });
  });

  /*
   * Tests list favorite albums with no sort option:
   *
   *    GET /tcos/{tco_id}/favorite-attendees{?sort}
   */
  it("/tcos/{tco_id}/favorite-attendees{?sort} should return" +
      " a list of favorite attendees.", function(done) {
    this.timeout(5000);
    var attributes = [ 'likes', 'attendee' ];
    var attendee_attributes = [
                               'id', 'tco_id', 'handle', 'name', 'type',
                               'avatar', 'email', 'country', 'quote',
                               'member_since', 'current_challenges'
                              ];
    var tco_id = 'tco14';
    var testUrl = setup.testUrl + "/tcos/" + tco_id + "/favorite-attendees";
    request.get(testUrl, function (err, res, body) {
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(2);
      body.response.should.be.an.instanceof(Array);
      body.response[0].should.have.keys(attributes);
      body.response[0].attendee.should.have.keys(attendee_attributes);
      body.response[0].attendee.tco_id.should.equal(tco_id);

      body.response[1].should.have.keys(attributes);
      body.response[1].attendee.should.have.keys(attendee_attributes);
      body.response[1].attendee.tco_id.should.equal(tco_id);
      done();
    });
  });

  /*
   * Tests list favorite attendees with ascending order:
   *
   *    GET /tcos/{tco_id}/favorite-attendees{?sort}
   */
  it("/tcos/{tco_id}/favorite-attendees{?sort} should return" +
      " a list of favorite attendees sorted ascendingly.", function(done) {
    this.timeout(5000);
    var attributes = [ 'likes', 'attendee' ];
    var attendee_attributes = [
                               'id', 'tco_id', 'handle', 'name', 'type',
                               'avatar', 'email', 'country', 'quote',
                               'member_since', 'current_challenges'
                              ];
    var tco_id = 'tco14';
    var testUrl = setup.testUrl + "/tcos/" + tco_id +
      "/favorite-attendees" + "?sort=asc";
    request.get(testUrl, function (err, res, body) {
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(2);
      body.response.should.be.an.instanceof(Array);
      body.response[0].should.have.keys(attributes);
      body.response[0].likes.should.equal(1);
      body.response[0].attendee.should.have.keys(attendee_attributes);
      body.response[0].attendee.tco_id.should.equal(tco_id);

      body.response[1].should.have.keys(attributes);
      body.response[1].likes.should.equal(2);
      body.response[1].attendee.should.have.keys(attendee_attributes);
      body.response[1].attendee.tco_id.should.equal(tco_id);

      done();
    });
  });

  /*
   * Tests list favorite attendees with descending order:
   *
   *    GET /tcos/{tco_id}/favorite-attendees{?sort}
   */
  it("/tcos/{tco_id}/favorite-attendees{?sort} should return" +
      " a list of favorite attendees sorted descendingly.", function(done) {
    this.timeout(5000);
    var attributes = [ 'likes', 'attendee' ];
    var attendee_attributes = [
                               'id', 'tco_id', 'handle', 'name', 'type',
                               'avatar', 'email', 'country', 'quote',
                               'member_since', 'current_challenges'
                              ];
    var tco_id = 'tco14';
    var testUrl = setup.testUrl + "/tcos/" + tco_id +
      "/favorite-attendees" + "?sort=desc";
    request.get(testUrl, function (err, res, body) {
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(2);
      body.response.should.be.an.instanceof(Array);
      body.response[0].should.have.keys(attributes);
      body.response[0].likes.should.equal(2);
      body.response[0].attendee.should.have.keys(attendee_attributes);
      body.response[0].attendee.tco_id.should.equal(tco_id);

      body.response[1].should.have.keys(attributes);
      body.response[1].likes.should.equal(1);
      body.response[1].attendee.should.have.keys(attendee_attributes);
      body.response[1].attendee.tco_id.should.equal(tco_id);

      done();
    });
  });

});