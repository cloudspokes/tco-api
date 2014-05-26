var pg = require('pg').native;

exports.messages = function(api, next){

  api.messages = {

    get: function(tco_id, id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT msgs.id, unique_id__c as tco_id, " +
        		"subject__c as subject, content__c as content, " +
        		"src.name as from_attendee_name, " +
        		"src.id as from_attendee, dst.name as to_attendee_name, " +
        		"dst.id as to_attendee, msgs.createddate as creation_date, " +
        		"msgs.status__c as status, msgs.attachment__c as attachment " +
        		"FROM salesforce.tco__c as tco " +
        		"INNER JOIN salesforce.tco_private_message__c as msgs " +
        		"ON tco.sfid = msgs.tco__c " +
        		"INNER JOIN salesforce.tco_attendee__c as src " +
        		"ON msgs.from_attendee__c = src.sfid " +
        		"INNER JOIN salesforce.tco_attendee__c as dst " +
        		"ON msgs.to_attendee__c = dst.sfid " +
        		"WHERE tco.unique_id__c = $1 AND msgs.id = $2";

        client.query(sql,[ tco_id, id ], function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      });
    }
  };

  next();
};