var pg = require('pg').native;
var forcifier = require('forcifier');

exports.tcos = function(api, next){

  api.tcos = {

    list: function(next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "select unique_id__c as id, city__c, " +
         "to_char(end_date__c, 'YYYY-MM-DD') as end_date, " +
         "to_char(start_date__c, 'YYYY-MM-DD') as start_date, " +
         "state__c, name, location__c, zip__c, website__c " +
         "from salesforce.TCO__c order by start_date__c desc";
        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(forcifier.deforceJson(rs['rows']));         
        })
      })
    },

    get: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "select unique_id__c as id, city__c, " +
         "to_char(end_date__c, 'YYYY-MM-DD') as end_date, " +
         "to_char(start_date__c, 'YYYY-MM-DD') as start_date, " +
         "state__c, name, location__c, zip__c, website__c " +
         "from salesforce.TCO__c as tco " +
         "where tco.unique_id__c = '"+params.id+"' order by start_date__c desc";

        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(forcifier.deforceJson(rs['rows']));         
        })
      })
    }
  };

  next();
}