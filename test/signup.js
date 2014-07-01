var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;
var Q = require("q");

describe('signup', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  

  describe('DELETE an attendee and INSERT', function(){

    before(function(done){
      api = setup.api;
      api.actions.versions.deleteAttendee = [1]
        api.actions.actions.deleteAttendee = {
          '1': {
            name:                   'deleteAttendee',
            description:            'Deletes a sample TEST attendee. Method: DELETE',
            outputExample:          {},
            matchExtensionMimeType: false,
            version:                1.0,
            toDocument:             true,
            inputs: {
              required: [],
              optional: []
            },

            run: function(api, connection, next){
              api.signup.delete(connection.params,function(data){
                connection.response.response = data;
                connection.response.count = data.length;
                next(connection, true);
              });
            }
          }
        }
        done();
    });

    after(function(done){
      done();
    });


    it("/signup should insert an user", function(done){
    this.timeout(10000);
    deleteAttendee().then(function(res){
     if(res) {
    	attributes = ["id","name","email","handle"];
	    var json_post = {
	      username: "sampleUser",
	      password: "sample",
	      email: "sample@tcosapi.com",
	      handle: "sampleTCO"
	    };
	    var json_string = JSON.stringify(json_post);
	    request.post(setup.testUrl + "/signup", {headers: {'content-type' : 'application/json'},
	      body: json_string},function(err, res, body){
	      body = JSON.parse(body);
	      res.statusCode.should.equal(200);
	      body.count.should.equal(1);
	      body.response.should.be.an.instanceOf(Array);
	      body.response[0]["name"].should.equal(json_post.username);
	      body.response[0]["email"].should.equal(json_post.email);
	      body.response[0]["handle"].should.equal(json_post.handle);
	      done();
	    });
	  }	
   	 });
    }); 

     it("/signup should NOT insert a SAME user", function(done){
	    this.timeout(5000);
	    attributes = ["id","name","email","handle"];
	    var json_post = {
	      username: "sampleUser",
	      password: "sample",
	      email: "sample@tcosapi.com",
	      handle: "sampleTCO"
	    };
	    var json_string = JSON.stringify(json_post);
	    request.post(setup.testUrl + "/signup", {headers: {'content-type' : 'application/json'},
	      body: json_string},function(err, res, body){
	      body = JSON.parse(body);
	      res.statusCode.should.equal(200);
	      body.response.should.equal("Email and handle should be unique. One or both already exists.");
	      done();
	    });
  	});

    function deleteAttendee() {
      var deferred = Q.defer();
      request.del(setup.testUrl + "/deleteAttendee", function(err, res, body){
        if (false) deferred.reject(false);
        if (true) deferred.resolve(true);
      });
           
      return deferred.promise;
    } 
});
  
});