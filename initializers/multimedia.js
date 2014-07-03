var pg = require('pg').native;
var Q = require("q");

exports.multimedia = function(api, next){

  function insertMedia(client,params){
    var deferred = Q.defer();
    client.connect(function(err) {
        var sql = "INSERT INTO salesforce.tco_multimedia__c (name,url__c,album__c,isdeleted) values ("+
          "'"+ params.name + "','" + params.url + "'," + 
          " (SELECT sfid from salesforce.tco_album__c where tco__c = "+
          " (SELECT sfid from salesforce.tco__c where unique_id__c = '" + params.tco_id +
          "') AND id = '" + params.album_id + "'), 'f') returning id";

        client.query(sql, function(err, rs) {
          if (err) deferred.reject(err);
          if (!err) deferred.resolve(rs);
        })
        return deferred.promise;
        })
      return deferred.promise;
      }
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
    },

    post: function(params, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      insertMedia(client,params).then(function(rs){
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
            id = rs.rows[0].id;
            client.query(sql, [params.tco_id, params.album_id, id], function(err, rs) {
                if (err) next(err);
                if (!err) next(rs['rows']);
              });
            });
        });
    }

  };

  next();
};