var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;
var pg = require('pg').native;
var Q = require("q");

describe.only('attendees', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  it("/tcos/#{tco_id}/attendees should return an array of attendees", function(done){
    this.timeout(5000);
    attributes = ["id","tco_id","handle","name","avatar","type","email","country","quote","member_since","current_challenges"];
    tco_id = 'tco14';
    request.get(setup.testUrl + "/tcos/"+tco_id+"/attendees", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(2);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].tco_id.should.equal(tco_id);
      body.response[1].tco_id.should.equal(tco_id);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });

  it("/tcos/#{tco_id}/attendees?{type} should return an array of attendees with type", function(done){
    this.timeout(5000);
    attributes = ["id","tco_id","handle","name","avatar","type","email","country","quote","member_since","current_challenges"];
    tco_id = 'tco13';
    type = 'Blogger';
    request.get(setup.testUrl + "/tcos/"+tco_id+"/attendees?type="+type, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].tco_id.should.equal(tco_id);
      body.response[0].type.should.equal(type);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });

  it("/tcos/#{tco_id}/attendees/#{id} should return an attendee", function(done){
    this.timeout(5000);
    attributes = ["id","tco_id","handle","name","avatar","type","email","country","quote","member_since","current_challenges"];
    tco_id = 'tco14';
    id = 1;
    request.get(setup.testUrl + "/tcos/"+tco_id+"/attendees/"+id, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].tco_id.should.equal(tco_id);
      body.response[0].id.should.equal(id);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });

  it("/tcos/#{tco_id}/attendees?{handle} should return an array of attendees with type", function(done){
    this.timeout(5000);
    attributes = ["id","tco_id","handle","name","avatar","type","email","country","quote","member_since","current_challenges"];
    tco_id = 'tco14';
    handle = 'jeffdonthemic';
    request.get(setup.testUrl + "/tcos/"+tco_id+"/attendees?handle="+handle, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].tco_id.should.equal(tco_id);
      body.response[0].handle.should.equal(handle);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });


  /*
   * Tests Attendee liked checker: GET /tcos/{tco_id}/attendee/{id}/like
   *
   * Expects the attendee to be liked.
   */
  it("/tcos/{tco_id}/attendee/{id}/like should return attendee liked.", function(done) {
    this.timeout(5000);
    request.get(setup.testUrl + "/tcos/tco14/attendees/1/like",
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
   * Tests Attendee liked checker: GET /tcos/{tco_id}/attendees/{id}/like
   *
   * Expects the attendee to not be liked.
   */
  it("/tcos/{tco_id}/attendees/{id}/like should return attendee not liked.", function(done) {
    this.timeout(5000);
    request.get(setup.testUrl + "/tcos/tco14/attendees/5/like",
      function (err, res, body) {
        body = JSON.parse(body);
        console.log(body);
        res.statusCode.should.equal(200);
        should.equal(body.count, null);
        body.response.should.be.an.instanceof(Object);
        body.response.liked.should.be.false;
        done();
      }
    );
  });

  it("/tcos/#{tco_id}/#{attendee_id}/unread-messages-count should return a count of unread messages", function(done){
    this.timeout(5000);
    tco_id = 'tco14';
    attendee_id = '2';
    request.get(setup.testUrl + "/tcos/"+tco_id+"/"+attendee_id+"/unread-messages-count", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].count.should.equal("1");
      done();
    });
  });

  /*
   * Tests liking an attendee: POST /tcos/{tco_id}/attendees/{id}/like
   */
  it("/tcos/{tco_id}/attendees/{id}/like should like an attendee.", function(done) {
    this.timeout(10000);

    checkLikedAsPromised(false)
      .then(function() {
        return postLikeAsPromised();
      })
      .then(function() {
        return checkLikedAsPromised(true);
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
    var sql = "DELETE FROM salesforce.tco_favorite__c WHERE fav_attendee__c" +
    " IN (SELECT a.sfid FROM salesforce.tco_attendee__c as a WHERE a.id = 5)";
    client.query(sql, function(err, rs) {
      if (err) deferred.reject(err);
      if (!err) deferred.resolve(rs);
    });
    return deferred.promise;
  }

  function checkLikedAsPromised(liked) {
    var deferred = Q.defer();
    request.get(setup.testUrl + "/tcos/tco13/attendees/5/like",
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.count, null);
        body.response.should.be.an.instanceof(Object);
        if (liked) body.response.liked.should.be.true;
        else body.response.liked.should.be.false;
        deferred.resolve();
      }
    );

    return deferred.promise;
  }

  function postLikeAsPromised() {
    var deferred = Q.defer();
    request.post(setup.testUrl + "/tcos/tco13/attendees/5/like",
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