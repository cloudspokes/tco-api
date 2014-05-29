var pg = require('pg').native;

exports.eventNotifications = function(api, next){

  api.eventNotifications = {
  
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
