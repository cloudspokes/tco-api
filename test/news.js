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

  /*
   * Tests Retrieve News: GET /tcos/{tco_id}/news/{id}
   */
  it("/tcos/{tco_id}/news/{id} should return a news object", function(done) {
    this.timeout(5000);
    attributes = [ 'id', 'tco_id', 'name', 'source_url',
                   'source', 'creation_date', 'content' ];
    tco_id = 'tco14';
    id = 1;
    request.get(setup.testUrl + "/tcos/" + tco_id + "/news/" + id,
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
   * Tests List News: GET /tcos/{tco_id}/news
   * with no source or start_time
   */
  it("/tcos/{tco_id}/news should return list of news", function(done) {
    this.timeout(5000);
    attributes = [ 'id', 'tco_id', 'name', 'source_url',
                   'source', 'creation_date', 'content' ];
    var tco_id = 'tco14';
    request.get(setup.testUrl + "/tcos/" + tco_id + "/news",
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.count.should.equal(1);
        body.response.should.be.an.instanceof(Array);
        body.response[0].should.to.have.keys(attributes);
        body.response[0].tco_id.should.equal(tco_id);
        done();
      }
    );
  });

  /*
   * Tests List News: GET /tcos/{tco_id}/news?{source}
   * with source and no start_time.
   *
   * Expects no results.
   */
  it("/tcos/{tco_id}/news?{source} should " +
    "return no news", function(done) {
    this.timeout(5000);
    attributes = [ 'id', 'tco_id', 'name', 'source_url',
                   'source', 'creation_date', 'content' ];
    var tco_id = 'tco14';
    var source = 'Facebook'
    request.get(setup.testUrl + "/tcos/" + tco_id +
      "/news?source=" + source,
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.count.should.equal(0);
        body.response.should.be.an.instanceof(Array);
        done();
      }
    );
  });

  /*
   * Tests List News: GET /tcos/{tco_id}/news?{source}
   * with source and no start_time.
   *
   * Expects a single result.
   */
  it("/tcos/{tco_id}/news?{source} should return " +
    "a news object", function(done) {
    this.timeout(5000);
    attributes = [ 'id', 'tco_id', 'name', 'source_url',
                   'source', 'creation_date', 'content' ];
    var tco_id = 'tco14';
    var source = 'Blog'
    request.get(setup.testUrl + "/tcos/" + tco_id +
      "/news?source=" + source,
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.count.should.equal(1);
        body.response.should.be.an.instanceof(Array);
        body.response[0].should.to.have.keys(attributes);
        body.response[0].tco_id.should.equal(tco_id);
        body.response[0].source.should.equal(source);
        done();
      }
    );
  });

  /*
   * Tests List News: GET /tcos/{tco_id}/news?{start_time}
   * with start_time and no source.
   *
   * Expects no result.
   */
  it("/tcos/{tco_id}/news?{start_time} should return " +
    "no result", function(done) {
    this.timeout(5000);
    attributes = [ 'id', 'tco_id', 'name', 'source_url',
                   'source', 'creation_date', 'content' ];
    var tco_id = 'tco14';
    var date = '2014-06-30T19:00:00.000Z';
    request.get(setup.testUrl + "/tcos/" + tco_id +
      "/news?start_time=" + date,
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.count.should.equal(0);
        body.response.should.be.an.instanceof(Array);
        done();
      }
    );
  });

  /*
   * Tests List News: GET /tcos/{tco_id}/news?{start_time}
   * with start_time and no source.
   *
   * Expects a single result.
   */
  it("/tcos/{tco_id}/news?{start_time} should return " +
    "a single news object.", function(done) {
    this.timeout(5000);
    attributes = [ 'id', 'tco_id', 'name', 'source_url',
                   'source', 'creation_date', 'content' ];
    var tco_id = 'tco14';
    var date = '2014-01-01T19:00:00.000Z';
    request.get(setup.testUrl + "/tcos/" + tco_id +
      "/news?start_time=" + date,
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.count.should.be.at.least(1);
        body.response.should.be.an.instanceof(Array);
        body.response[0].should.to.have.keys(attributes);
        body.response[0].tco_id.should.equal(tco_id);
        done();
      }
    );
  });

  /*
   * Tests List News: GET /tcos/{tco_id}/news?{start_time, source}
   * with both start_time and source.
   *
   * Expects a single result.
   */
  it("/tcos/{tco_id}/news?{start_time, source} should return " +
    "a single news object.", function(done) {
    this.timeout(5000);
    attributes = [ 'id', 'tco_id', 'name', 'source_url',
                   'source', 'creation_date', 'content' ];
    var tco_id = 'tco14';
    var date = '2014-01-01T19:00:00.000Z';
    var source = 'Blog';
    request.get(setup.testUrl + "/tcos/" + tco_id +
      "/news?start_time=" + date + "&source=" + source,
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.count.should.be.at.least(1);
        body.response.should.be.an.instanceof(Array);
        body.response[0].should.to.have.keys(attributes);
        body.response[0].tco_id.should.equal(tco_id);
        body.response[0].source.should.equal(source);
        done();
      }
    );
  });
});