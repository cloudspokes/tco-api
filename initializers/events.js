var pg = require('pg').native;

exports.events = function(api, next){

  api.events = {

    list: function(params, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "select event.id, event.name, event.type__c as type, event.details__c as details, " +
         "event.start_time__c as start_time, event.end_time__c as end_time, " +
         "event.location__c as location, tco.unique_id__c as tco_id " +
         "from salesforce.tco_event__c as event " +
         "inner join salesforce.tco__c as tco on event.tco__c = tco.sfid " +
         "where tco.unique_id__c = '"+params.tco_id+"'" ; // need appriopriate order by
        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);         
        })
      })
    },

    get: function(params, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "select event.id, event.name, event.type__c as type, event.details__c as details, " +
         "event.start_time__c as start_time, event.end_time__c as end_time, " +
         "event.location__c as location, tco.unique_id__c as tco_id " +
         "from salesforce.tco_event__c as event " +
         "inner join salesforce.tco__c as tco on event.tco__c = tco.sfid " +
         "where tco.unique_id__c = '"+params.tco_id+ "' AND " +
         "event.id = '" + params.id +"'"; 
         
        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);         
        })
      })
    }

  };

  next();
}