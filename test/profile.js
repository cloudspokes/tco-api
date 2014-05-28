var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('profile', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  it("/my_profile/#{id} should return a single attendee array", function(done){
    this.timeout(5000);
    attributes = ["id","tco_id","handle","name","avatar","type","email","country","quote","member_since","current_challenges"];
    id = 1;
    request.get(setup.testUrl + "/my-profile/"+id, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].id.should.equal(id);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });  

  it("/my_profile/#{id} should update a single attendee", function(done){
    this.timeout(5000);
    attributes = ["id","tco_id","handle","name","avatar","type","email","country","quote","member_since","current_challenges"];
    id = 1;
    var json_post = {
      quote: "Sample quote",
      country: "USA"     
  	};
    var json_string = JSON.stringify(json_post);
    request.put(setup.testUrl + "/my-profile/"+id,{headers: {'content-type' : 'application/json'},
      body: json_string}, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].id.should.equal(id);
      body.response[0].quote.should.equal(json_post.quote);
      body.response[0].country.should.equal(json_post.country);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });    

});