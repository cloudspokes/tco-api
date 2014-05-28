var pg = require('pg').native;
var forcifier = require('forcifier');

exports.profile = function(api, next){

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
    }
  };

  next();
}