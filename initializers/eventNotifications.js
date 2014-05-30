var pg = require('pg').native;

exports.eventNotifications = function(api, next){

  api.eventNotifications = {
  
    list: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "select notification.id, tco.unique_id__c as tco_id, notification.name, event.start_time__c as start_time, " +
        " event.end_time__c as end_time, event.location__c as location, event.type__c as type from salesforce.tco_event_notification__c as notification "+
        "inner join salesforce.tco_attendee__c as attendee"+
        " on attendee.sfid = notification.attendee__c"+
        " inner join salesforce.tco_event__c as event"+
        " on event.sfid = notification.event__c"+
        " inner join salesforce.tco__c as tco"+
        " on tco.sfid = event.tco__c"+
        " where attendee.id = '" + params.id  + "'";

        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        })
      })
    },
    
    post: function(params, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "insert into salesforce.tco_event_notification__c " +  
        "(event__c,attendee__c) values " +
        "((SELECT sfid from salesforce.tco__c where unique_id__c = '"+ params.tco_id +"')" + ",(SELECT sfid from salesforce.tco_attendee__c where id = '" + params.id +"'))"

        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      });      
    },
      
    getCount: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "select COUNT(*) from salesforce.tco_event_notification__c "+
        "inner join salesforce.tco_attendee__c"+
        " on salesforce.tco_attendee__c.sfid = salesforce.tco_event_notification__c.attendee__c"+
        " inner join salesforce.tco__c"+
        " on salesforce.tco__c.sfid = salesforce.tco_attendee__c.tco__c"+
        " where salesforce.tco_attendee__c.id = '" + params.id  + "'";

        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);         
        });
      });
    }
  }
   
  next();
};
