var pg = require('pg').native;

exports.news = function(api, next){

  api.news = {

    get: function(tco_id, id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT news.id, unique_id__c as tco_id, " +
          "news.name, source_url__c as source_url, source__c as source, " +
          "to_char(news.createddate, 'YYYY-MM-DD HH24:MI:SS') as creation_date, " +
          "content__c as content " +
          "FROM salesforce.tco_news__c as news INNER JOIN salesforce.tco__c " +
          "ON news.tco__c = tco__c.sfid " +
          "WHERE unique_id__c = $1 AND news.id = $2";
        client.query(sql, [tco_id, id], function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      });
    },

    list: function(tco_id, source, start_time, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT news.id, unique_id__c as tco_id, " +
          "news.name, source_url__c as source_url, source__c as source, " +
          "to_char(news.createddate, 'YYYY-MM-DD HH24:MI:SS') as creation_date, " +
          "content__c as content " +
          "FROM salesforce.tco_news__c as news INNER JOIN salesforce.tco__c " +
          "ON news.tco__c = tco__c.sfid " +
          "WHERE unique_id__c = $1";

        var params = [ tco_id ];
        var params_count = [ '$3', '$2' ];
        if (source) {
          sql += " AND source__c = " + params_count.pop();
          params.push(source);
        }

        if (start_time) {
          sql += " AND news.createddate > " + params_count.pop();
          params.push(start_time);
        }

        client.query(sql, params, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      });
    }
  };

  next();
};