var pg = require('pg').native;

exports.messages = function(api, next){

  api.messages = {

    list: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "select messages.id, tco.unique_id__c as tco_id, "+
         "subject__c as subject, "+
         "from_attendee.name as from_attendee_name, "+
         "from_attendee.id as from_attendee, "+
         "to_attendee.name as to_attendee_name, "+
         "to_attendee.id as to_attendee, "+
         "messages.createddate as creation_date, messages.status__c as status, "+
         "messages.attachment__c as attachment "+
         "from salesforce.TCO__c as tco INNER JOIN salesforce.tco_private_message__c as messages "+
         "on tco.sfid = messages.tco__c INNER JOIN salesforce.tco_attendee__c as from_attendee "+
         "on messages.from_attendee__c = from_attendee.sfid INNER JOIN "+
         "salesforce.tco_attendee__c as to_attendee on messages.to_attendee__c = to_attendee.sfid "+
         "where tco.unique_id__c = $1 "

         if (params.from) sql += " AND from_attendee.id = '" + params.from + "'";
         if (params.to) sql += " AND to_attendee.id = '" + params.to + "'";
        client.query(sql,[params.tco_id], function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);         
        })
      })
    },

    delete: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "delete from salesforce.tco_private_message__c as messages "+
            "where tco__c = (SELECT sfid from salesforce.TCO__c where unique_id__c = $1) AND id = $2";
        client.query(sql,[params.tco_id,params.id], function(err, rs) {
          if (err) next(err);
          if (!err) next(rs);         
        })
      })
    },

    // Sample test message 
    addTestMessage: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "insert into salesforce.tco_private_message__c (id,tco__c,from_attendee__c,to_attendee__c) values ( '" +
          +params.id +"','a1SU00000016eF7MAI','a1UU0000001VJyaMAG','a1UU0000001VMyyMAG');";
        client.query(sql, function(err, rs) {
          if (err) next(true);
          if (!err) next(false);         
        })
      })
    },   

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
