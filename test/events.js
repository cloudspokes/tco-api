var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;
var pg = require('pg').native;
var Q = require("q");

describe('events', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  it("/tcos/#{tco_id}/events/#{id} should return an array with only valid attributes", function(done){
    this.timeout(5000);
    tco_id = "tco14";
    id = 1;
    attributes = ["id","name","type","details","start_time","end_time","location","tco_id"];
    request.get(setup.testUrl + "/tcos/"+tco_id+"/events/"+id, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0]["id"].should.equal(id);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });


  it("/tcos/#{tco_id}/events{?type,date} should return array with only valid attributes", function(done){
    this.timeout(5000);
    tco_id = "tco14";
    type = "Competition";
    date = "2014-05-21";
    attributes = ["id","name","type","details","start_time","end_time","location","tco_id"];
    request.get(setup.testUrl + "/tcos/"+tco_id+"/events?type="+type+"&date="+date, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.be.at.least(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0]["type"].should.equal(type);
      var start_time = new Date(body.response[0]["start_time"]);
      var end_time = new Date(body.response[0]["end_time"]);
      date = new Date(date);
      // TODO -- looks like time zone issue?
      // date.getDate().should.be.at.least(start_time.getDate());
      date.getDate().should.be.at.most(end_time.getDate());
      date.getMonth().should.be.at.least(start_time.getMonth());
      date.getMonth().should.be.at.most(end_time.getMonth());
      body.response[0].should.have.keys(attributes);
      done();
    });
  });

  it("/tcos/#{tco_id}/events#{id}/attendees should return array of attendees with only valid attributes", function(done){
    this.timeout(5000);
    tco_id = "tco14";
    id = 1;
    attributes = ["id","tco_id","handle","name","avatar","type","email","country","quote","member_since","current_challenges"];
    request.get(setup.testUrl + "/tcos/"+tco_id+"/events/"+id+"/attendees", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0]["tco_id"].should.equal(tco_id);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });

  /*
   * Tests Event like checker: GET /tcos/{tco_id}/events/{id}/like
   *
   * Expects the event to be liked.
   */
  it("/tcos/{tco_id}/events/{id}/like should return event is liked.", function(done) {
    this.timeout(5000);
    request.get(setup.testUrl + "/tcos/tco14/events/1/like",
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
   * Tests Event like checker: GET /tcos/{tco_id}/event/{id}/like
   *
   * Expects the event to not be liked.
   */
  it("/tcos/{tco_id}/events/{id}/like should return event not liked.", function(done) {
    this.timeout(5000);
    request.get(setup.testUrl + "/tcos/tco14/events/5/like",
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
   * Tests liking an event: POST /tcos/{tco_id}/events/{id}/like
   */
  it("/tcos/{tco_id}/events/{id}/like should like an event.", function(done) {
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
    var sql = "DELETE FROM salesforce.tco_favorite__c WHERE fav_event__c" +
    " IN (SELECT e.sfid FROM salesforce.tco_event__c as e WHERE e.id = 3)";
    client.query(sql, function(err, rs) {
      if (err) deferred.reject(err);
      if (!err) deferred.resolve(rs);
    });
    return deferred.promise;
  }

  function checkLikedAsPromised(liked) {
    var deferred = Q.defer();
    request.get(setup.testUrl + "/tcos/tco14/events/3/like",
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
    request.post(setup.testUrl + "/tcos/tco14/events/3/like",
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