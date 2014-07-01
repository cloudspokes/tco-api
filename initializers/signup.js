var pg = require('pg').native;
var Q = require("q");
var forcifier = require('forcifier');

function checkIfExists(client,params) {
      var deferred = Q.defer();
      var sql = "SELECT id FROM salesforce.tco_attendee__c where email__c = '"+
            params.email + "' OR handle__c = '" + params.handle + "'";
      client.connect(function(err) {
        client.query(sql, function(err, rs) {
          if (err) deferred.reject(err);
          if (!err) deferred.resolve(rs);
        });
        return deferred.promise;
      });
    return deferred.promise;
  }

exports.signup = function(api, next){
  api.signup = {

    post: function(params, next) {
      var client = new pg.Client(api.config.general.pg.connString);
        client.connect(function(err) {
        return checkIfExists(client,params).then(function(result){
            if(result["rows"].length > 0){
              next("Email and handle should be unique. One or both already exists.");
            } else {
              var optionals = ["first_name","last_name","display_name","avatar","quote","country"];
              for(var key in optionals) {
                if (!params[optionals[key]]) {
                  params[optionals[key]] = "";
                }   
              }
              var sql = "INSERT into salesforce.tco_attendee__c (name,password__c,email__c,handle__c,first_name__c,"+
              "last_name__c, display_name__c,avatar__c,quote__c,country__c) values "+
              "('" + params.username +"','" + params.password +"','" + params.email + "','" + params.handle +"','"+
              params.first_name + "','" + params.last_name + "','" + params.display_name + "','" + params.avatar + "','"+
              params.quote + "','" + params.country + "') returning id,name,email__c,handle__c";
              client.query(sql, function(err, rs) {
                console.log(sql);
                if (err) next(err);
                if (!err) next(forcifier.deforceJson(rs['rows']));
              });
          }
        });
      
      });
    },

    delete: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "DELETE from salesforce.tco_attendee__c where handle__c = 'sampleTCO'";
        client.query(sql, function(err, rs){
          if(err) next(false);
          if(!err) next(true);
        });
      });
    }

  };

  next();
};