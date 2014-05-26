var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('messages', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  it("/tcos/{tco_id}/messages/{id} should return a single message.", function(done){
    this.timeout(5000);
    var tco_id = "tco14";
    var id = 1;
    var attributes = [ "id", "tco_id", "subject", "content",
                       "from_attendee", "from_attendee_name",
                       "to_attendee", "to_attendee_name",
                       "creation_date", "status", "attachment"
                     ];
    request.get(setup.testUrl + "/tcos/" + tco_id + "/messages/" + id,
      function(err, res, body){
        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        body.count.should.equal(1);
        body.response.should.be.an.instanceOf(Array);
        body.response[0]["tco_id"].should.equal(tco_id);
        body.response[0].should.have.keys(attributes);
        done();
      }
    );
  });

});