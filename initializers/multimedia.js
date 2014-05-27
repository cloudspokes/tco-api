var pg = require('pg').native;

exports.multimedia = function(api, next){

  api.multimedia = {

    get: function(tco_id, album_id, id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT multimedia.id, unique_id__c as tco_id, " +
          "album.id as album_id, multimedia.name, " +
          "multimedia.url__c as url " +
          "FROM salesforce.tco_multimedia__c as multimedia " +
          "INNER JOIN salesforce.tco_album__c as album " +
          "ON album.sfid = multimedia.album__c " +
          "INNER JOIN salesforce.tco__c ON album.tco__c = tco__c.sfid " +
          "WHERE unique_id__c = $1 AND album.id = $2" +
          "AND multimedia.id = $3";
        client.query(sql, [tco_id, album_id, id], function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      });
    },

    list: function(tco_id, album_id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT multimedia.id, unique_id__c as tco_id, " +
          "album.id as album_id, multimedia.name, " +
          "multimedia.url__c as url " +
          "FROM salesforce.tco_multimedia__c as multimedia " +
          "INNER JOIN salesforce.tco_album__c as album " +
          "ON album.sfid = multimedia.album__c " +
          "INNER JOIN salesforce.tco__c ON album.tco__c = tco__c.sfid " +
          "WHERE unique_id__c = $1 AND album.id = $2";
        client.query(sql, [tco_id, album_id], function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      });
    }

  };

  next();
};