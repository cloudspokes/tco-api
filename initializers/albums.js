var pg = require('pg').native;

exports.albums = function(api, next) {

  api.albums = {

    get: function(tco_id, id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT album.id as id, unique_id__c as tco_id, " +
          "album.name as name, cover__c as cover " +
          "FROM salesforce.tco_album__c as album " +
          "INNER JOIN salesforce.tco__c as tco ON album.tco__c = tco.sfid " +
          "WHERE unique_id__c = $1 AND album.id = $2";
        client.query(sql, [tco_id, id], function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      });
    },

    list: function(tco_id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT album.id as id, unique_id__c as tco_id, " +
          "album.name as name, cover__c as cover " +
          "FROM salesforce.tco_album__c as album " +
          "INNER JOIN salesforce.tco__c as tco ON album.tco__c = tco.sfid " +
          "WHERE unique_id__c = $1";
        client.query(sql, [ tco_id ], function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      });
    },

    isLiked: function(tco_id, id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT COUNT(*) as likes_count " +
          "FROM salesforce.tco_favorite__c as favorite " +
          "INNER JOIN salesforce.tco_album__c as album " +
          "ON favorite.fav_album__c = album.sfid " +
          "INNER JOIN salesforce.tco__c " +
          "ON tco__c.sfid = album.tco__c " +
          "WHERE unique_id__c = $1 AND album.id = $2";
        client.query(sql, [ tco_id, id ], function(err, rs) {
          if (err) next(err);
          if (!err) next({ liked: rs['rows'][0].likes_count > 0 });
        });
      });
    }
  };

  next();
};