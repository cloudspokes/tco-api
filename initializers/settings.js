var pg = require('pg').native;
var Q = require("q");
var forcifier = require('forcifier');

var MY_SETTINGS_GET= "SELECT attendee.event_push_notifications__c, allow_private_messages__c" +
        " FROM salesforce.tco_attendee__c as attendee" +
        "   INNER JOIN salesforce.tco__c as tco on attendee.tco__c = tco.sfid" +
        " WHERE attendee.id = $1";

exports.settings = function(api, next){

  api.settings = {
    get: function(id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      return createDeferedConnection(client)
        .then(function() {
          return createDeferedQuery(client, MY_SETTINGS_GET, [id]);
        })
        .then(function(rs) {
          next(forcifier.deforceJson(rs['rows']));
        });
    }
  }

  next();
}

function createDeferedConnection(client) {
  var deferred = Q.defer();
  client.connect(function(err) {
    if (err) deferred.reject("Error: no connection to postgres database");
    if (!err) deferred.resolve();
  });
  return deferred.promise;
}

function createDeferedQuery(client, sql, params) {
  var deferred = Q.defer();
  client.query(sql, params, function(err, rs) {
    if (err) deferred.reject(err);
    if (!err) deferred.resolve(rs);
  });
  return deferred.promise;
}
