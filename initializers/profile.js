var pg = require('pg').native;
var forcifier = require('forcifier');
var Q = require("q");

exports.profile = function(api, next){

  function updateProfile(client,params) {
    var deferred = Q.defer();
    client.connect(function(err) {
    var sql = "UPDATE  salesforce.tco_attendee__c SET ";
    if(params.name) sql+= "salesforce.tco_attendee__c.name = '"+ params.name +"',";
    if(params.type) sql+= "type__c = '" + params.type +"',";
    if(params.email) sql+= "email__c = '" + params.email +"',";
    if(params.country) sql+= "country__c = '" + params.country + "',";
    if(params.quote) sql += "quote__c = '" + params.quote + "',";

    sql = sql.substring(0, sql.length - 1);
    sql += " where salesforce.tco_attendee__c.id = '"+params.id + "' returning id";


    client.query(sql, function(err, rs) {
      if (err) deferred.reject(err);
      if (!err) deferred.resolve(rs);
    })
    return deferred.promise;
   })
   return deferred.promise;
  }

  api.profile = {

    get: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "select salesforce.tco_attendee__c.id as id, "+
        "unique_id__c as tco_id, handle__c as handle,"+
        "salesforce.tco_attendee__c.name, avatar__c as avatar,"+
        "type__c as type, email__c as email,"+
        "country__c as country,quote__c as quote,"+
        "to_char(member_since__c,'YYYY-MM-DD') as member_since,"+
        "current_challenges__c as current_challenges from salesforce.tco__c "+
        "inner join salesforce.tco_attendee__c"+
        " on salesforce.tco_attendee__c.tco__c = salesforce.tco__c.sfid"+
        " where salesforce.tco_attendee__c.id = '"+params.id + "'";

        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(forcifier.deforceJson(rs['rows']));         
        })
      })
    },

    update: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      updateProfile(client,params).then(function(){
        client.connect(function(err) {
              var sql = "select salesforce.tco_attendee__c.id as id, "+
              "unique_id__c as tco_id, handle__c as handle,"+
              "salesforce.tco_attendee__c.name, avatar__c as avatar,"+
              "type__c as type, email__c as email,"+
              "country__c as country,quote__c as quote,"+
              "to_char(member_since__c,'YYYY-MM-DD') as member_since,"+
              "current_challenges__c as current_challenges from salesforce.tco__c "+
              "inner join salesforce.tco_attendee__c"+
              " on salesforce.tco_attendee__c.tco__c = salesforce.tco__c.sfid"+
              " where salesforce.tco_attendee__c.id = '"+params.id + "'";

              client.query(sql, function(err, rs) {
                if (err) next(err);
                if (!err) next(forcifier.deforceJson(rs['rows']));         
              })
            })
      });
    },

    getChallenges: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT events.id as id, tcos.unique_id__c as tco_id, " +
          "events.name as name, events.start_time__c as start_time, "+
          "events.end_time__c as end_time, events.contest_type__c as contest_type, "+
          "events.contest_purse__c || '$' as contest_purse, "+
          "events.contest_points__c as contest_points "+
          "FROM salesforce.tco_event__c as events inner join "+
          "salesforce.tco__c as tcos on tcos.sfid = events.tco__c "+
          "inner join salesforce.tco_attendee__c as attendees on attendees.tco__c = tcos.sfid "+
          "inner join salesforce.tco_event_participant__c as participants "+
          "on participants.attendee__c = attendees.sfid AND participants.event__c = events.sfid "+
          " where attendees.id = '" + params.id + "' AND events.type__c = 'Competition'"; 
        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      })
    }
  };

  next();
}