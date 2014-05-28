var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;
var pg = require('pg').native;
var Q = require("q");

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

  /*
   * Tests Album liked checker: GET /tcos/{tco_id}/albums/{id}/like
   *
   * Expects the album to be liked.
   */
  it("/tcos/{tco_id}/albums/{id}/like should return if album liked.", function(done) {
    this.timeout(5000);
    request.get(setup.testUrl + "/tcos/tco14/albums/1/like",
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.count, null);
        body.response.should.be.an.instanceof(Object);
        body.response.liked.should.be.true;
        done();
      }
    );
  });

  /*
   * Tests Album liked checker: GET /tcos/{tco_id}/albums/{id}/like
   *
   * Expects the album to not be liked.
   */
  it("/tcos/{tco_id}/albums/{id}/like should return if album liked.", function(done) {
    this.timeout(5000);
    request.get(setup.testUrl + "/tcos/tco14/albums/2/like",
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.count, null);
        body.response.should.be.an.instanceof(Object);
        body.response.liked.should.be.false;
        done();
      }
    );
  });

  /*
   * Tests liking an album: POST /tcos/{tco_id}/albums/{id}/like
   */
  it("/tcos/{tco_id}/albums/{id}/like should like an album.", function(done) {
    this.timeout(25000);
    postLikeAsPromised()
      .then(function() {
        return checkLikedAsPromised();
      })
      .then(function() {
        var client = new pg.Client(setup.api.config.general.pg.connString);
        return createConnectionAsPromised(client);
      })
      .then(function(client) {
        return executeCleanupQueryAsPromised(client);
      })
      .then(function(rs) {
        rs.rowCount.should.equal(1);
        done();
      })
      .fail(function(err) {
        console.log(err);
        should.not.exist(err);
      });

  });

  function createConnectionAsPromised(client) {
    var deferred = Q.defer();
    client.connect(function(err) {
      if (err) deferred.reject("Error: no connection to postgres database");
      if (!err) deferred.resolve(client);
    });
    return deferred.promise;
  }

  function executeCleanupQueryAsPromised(client) {
    var deferred = Q.defer();
    var sql = "DELETE FROM salesforce.tco_favorite__c WHERE fav_album__c" +
    " IN (SELECT a.sfid FROM salesforce.tco_album__c as a WHERE a.id = 2)";
    client.query(sql, function(err, rs) {
      if (err) deferred.reject(err);
      if (!err) deferred.resolve(rs);
    });
    return deferred.promise;
  }

  function checkLikedAsPromised(albumId) {
    var deferred = Q.defer();
    request.get(setup.testUrl + "/tcos/tco14/albums/2/like",
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.count, null);
        body.response.should.be.an.instanceof(Object);
        body.response.liked.should.be.true;
        deferred.resolve();
      }
    );

    return deferred.promise;
  }

  function postLikeAsPromised() {
    var deferred = Q.defer();
    request.post(setup.testUrl + "/tcos/tco14/albums/2/like",
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.response.rowCount.should.equal(1);
        deferred.resolve();
      }
    );

    return deferred.promise;
  }

});