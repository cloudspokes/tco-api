var pg = require('pg').native;

exports.sponsors = function(api, next){

  api.sponsors = {

    get: function(tco_id, id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT sponsor.id, unique_id__c as tco_id, " +
          "sponsor.name, sponsor.level__c as level, " +
          "sponsor.logo__c as logo_url, sponsor.video__c as video_url, " +
          "sponsor.description__c as description " +
          "FROM salesforce.tco__c " +
          "INNER JOIN salesforce.tco_sponsor__c as sponsor " +
          "ON sponsor.tco__c = salesforce.tco__c.sfid " +
          "WHERE unique_id__c = $1 AND sponsor.id = $2";
        client.query(sql, [tco_id, id], function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      });
    },

    list: function(next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT sponsor.id, unique_id__c as tco_id, " +
        "sponsor.name, sponsor.level__c as level, " +
        "sponsor.logo__c as logo_url, sponsor.video__c as video_url, " +
        "sponsor.description__c as description " +
        "FROM salesforce.tco__c " +
        "INNER JOIN salesforce.tco_sponsor__c as sponsor " +
        "ON sponsor.tco__c = salesforce.tco__c.sfid";
        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      });
    },

  },

  next();
};