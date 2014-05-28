var request = require("request");
var should = require('chai').should();
var setup = require("./_setup.js")._setup;

describe('My Profiles settings. GET: ', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  it("/my-profile/settings should return two settings", function(done){
    this.timeout(5000);
    var attributes = ['event_push_notifications', 'allow_private_messages'];

    request.get(setup.testUrl + "/my-profile/2/settings", function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].should.have.keys(attributes);
      done();
    });
  });
});

describe('My Profiles settings. PUT: ', function(){

  before(function(done){
    setup.init(done);
  });

  after(function(done){
    // no teadrown needed at this time
    done();
  });

  it("/my-profile/settings should return two settings", function(done){
    this.timeout(5000);
    var attributes = ['event_push_notifications', 'allow_private_messages'];

    request.put(setup.testUrl + "/my-profile/2/settings",
           {form: {eventPushNotifications:'true',
                   allowPrivateMessages: 'false'}}, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].should.have.keys(attributes);
      body.response[0].event_push_notifications.should.be.true;
      body.response[0].allow_private_messages.should.be.false;
      done();
    });
  });

  it("/my-profile/settings should return two settings", function(done){
    this.timeout(5000);
    var attributes = ['event_push_notifications', 'allow_private_messages'];

    request.post(setup.testUrl + "/my-profile/2/settings",
           {form: {eventPushNotifications:'false',
                   allowPrivateMessages: 'true'}}, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      body.count.should.equal(1);
      body.response.should.be.an.instanceOf(Array);
      body.response[0].should.have.keys(attributes);
      body.response[0].event_push_notifications.should.be.false;
      body.response[0].allow_private_messages.should.be.true;
      done();
    });
  });

  it("/my-profile/settings should return error", function(done){
    this.timeout(5000);
    var attributes = ['event_push_notifications', 'allow_private_messages'];

    request.post(setup.testUrl + "/my-profile/2/settings",
           {form: {allowPrivateMessages: 'false'}}, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      (body.error ==='Error: eventPushNotifications is a required parameter for this action').should.be.true;
      done();
    });
  });

  it("/my-profile/settings should return error", function(done){
    this.timeout(5000);
    var attributes = ['event_push_notifications', 'allow_private_messages'];

    request.post(setup.testUrl + "/my-profile/2/settings",
           {form: {eventPushNotifications:'false'}}, function(err, res, body){
      body = JSON.parse(body);
      res.statusCode.should.equal(200);
      console.log(body.error);
      (body.error ==='Error: allowPrivateMessages is a required parameter for this action').should.be.true;
      done();
    });
  });
});