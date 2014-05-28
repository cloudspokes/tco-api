var pg = require('pg').native;
var Q = require("q");
var forcifier = require('forcifier');

var MY_SETTINGS_GET= "SELECT attendee.event_push_notifications__c, allow_private_messages__c" +
        " FROM salesforce.tco_attendee__c as attendee" +
        " WHERE attendee.id = $1";

var MY_SETTINGS_POST= "UPDATE salesforce.tco_attendee__c as attendee SET event_push_notifications__c = $2," +
        " allow_private_messages__c = $3" +
        " WHERE attendee.id = $1";

exports.settings = function(api, next){
  api.settings = {
    get: function(id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      return api.helper.createDeferedConnection(client)
        .then(function() {
          return api.helper.createDeferedQuery(client, MY_SETTINGS_GET, [id]);
        })
        .then(function(rs) {
          next(forcifier.deforceJson(rs['rows']));
        });
    },

    post: function(params, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      return api.helper.createDeferedConnection(client)
        .then(function() {
          return api.helper.createDeferedQuery(client, MY_SETTINGS_POST,  [params.id,
                                                                params.eventPushNotifications === 'true' ? 't' : 'f',
                                                                params.allowPrivateMessages === 'true' ? 't' : 'f']);
        })
        .then(function() {
          return api.helper.createDeferedQuery(client, MY_SETTINGS_GET, [params.id]);
        })
        .then(function(rs) {
          next(forcifier.deforceJson(rs['rows']));
        });
    }
  }

  next();
}
