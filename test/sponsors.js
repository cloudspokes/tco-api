var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;
var pg = require('pg').native;
var Q = require("q");

describe('sponsors', function(){

  var timeoutInterval = 15000;

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
    var attributes = [ 'id', 'tco_id', 'name', 'level',
                       'logo_url', 'video_url', 'description' ];
    var tco_id = 'tco14';
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

  /*
   * Tests list all Sponsors: GET /tcos/{tco_id}/sponsors
   */
  it("/tcos/{tco_id}/sponsors should return no sponsors", function(done) {
    this.timeout(timeoutInterval);
    var tco_id = 'tco13';
    request.get(setup.testUrl + "/tcos/" + tco_id + "/sponsors",
      function (err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.count.should.equal(0);
        done();
      }
    );
  });

  /*
   * Tests apply sponsor: POST /tcos/{tco_id}/sponsors/{id}/apply
   *
   * name is provided.
   */
  it("/tcos/{tco_id}/sponsors/{id}/apply should apply a sponsor", function(done) {
    this.timeout(timeoutInterval);
    testApplySponsor('SA-2000-TEST', done);
  });

  /*
   * Tests apply sponsor: POST /tcos/{tco_id}/sponsors/{id}/apply
   *
   * name is not provided.
   */
  it("/tcos/{tco_id}/sponsors/{id}/apply should apply a sponsor", function(done) {
    this.timeout(timeoutInterval);
    testApplySponsor(null, done);
  });

  function testApplySponsor(sponsorApplicantName, done) {
    var testSponsorName = 'testsponsor';
    var client = new pg.Client(setup.api.config.general.pg.connString);
    createConnectionAsPromised(client)
      .then(function() {
        return executeCleanupQueryAsPromised(client, testSponsorName);
      })
      .then(function() {
        return insertTestSponsorAsPromised(client, testSponsorName);
      })
      .then(function(sponsorId) {
        return applySponsorAsPromised(sponsorId, sponsorApplicantName);
      })
      .then(function() {
        executeCleanupQueryAsPromised(client, testSponsorName);
        done();
      })
      .fail(function(err) {
        console.log(err);
        should.not.exist(err);
      });
  }

  function createConnectionAsPromised(client) {
    var deferred = Q.defer();
    client.connect(function(err) {
      if (err) deferred.reject("Error: no connection to postgres database");
      if (!err) deferred.resolve(client);
    });
    return deferred.promise;
  }

  function executeCleanupQueryAsPromised(client, testSponsorName) {
    var deferred = Q.defer();
    var sql = "DELETE FROM salesforce.tco_sponsor_applicant__c WHERE sponsor__c = '" +
    testSponsorName + "'; DELETE FROM salesforce.tco_sponsor__c WHERE sfid = '" +
    testSponsorName + "';";
    client.query(sql, function(err, rs) {
      if (err) deferred.reject(err);
      if (!err) deferred.resolve(rs);
    });
    return deferred.promise;
  }

  function insertTestSponsorAsPromised(client, testSponsorName) {
    var deferred = Q.defer();
    var sql = "INSERT INTO salesforce.tco_sponsor__c(sfid,name) VALUES($1,$2) RETURNING id";
    client.query(sql, [ testSponsorName, testSponsorName ], function(err, rs) {
      if (err) deferred.reject(err);
      if (!err) {
        rs.rows.should.be.an.instanceof(Array);
        rs.rows.length.should.equal(1);
        should.exist(rs.rows[0].id);
        deferred.resolve(rs.rows[0].id);
      }
    });
    return deferred.promise;
  }

  function applySponsorAsPromised(sponsorId, testSponsorApply) {
    var deferred = Q.defer();
    request.post(setup.testUrl + "/tcos/tco14/sponsors/" + sponsorId + "/apply",
      {
        form : {
          attendee_id: 1,
          name: testSponsorApply
        }
      }, function(err, res, body) {
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.response.rowCount.should.equal(1);
        deferred.resolve();
      });

    return deferred.promise;
  }

});