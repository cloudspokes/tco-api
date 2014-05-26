var pg = require('pg').native;

exports.favorites = function(api, next){

  var compareByLikesAsc = function(a, b) {
    if (a.likes < b.likes) return -1;
    if (a.likes > b.likes) return 1;
    return 0;
  };

  var compareByLikesDesc = function(a, b) {
    return compareByLikesAsc(a, b) * -1;
  };

  var executeSql = function(type, sql, tco_id, sort, next) {
    var client = new pg.Client(api.config.general.pg.connString);
    client.connect(function(err) {
      client.query(sql, [ tco_id ], function(err, rs) {
        if (err) next(err);
        obj = {};
        for (var i = 0; i < rs['rows'].length; ++i) {
          if (rs['rows'][i].id in obj) {
            ++obj[rs['rows'][i].id].likes;
          } else {
            newEntry = { 'likes': 1 };
            newEntry[type] = rs['rows'][i];
            obj[rs['rows'][i].id] = newEntry;
          }
        }

        result = [];
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            result.push(obj[key]);
          }
        }

        if (sort === 'desc')
          result.sort(compareByLikesDesc);
        else if(sort === 'asc')
          result.sort(compareByLikesAsc);

        next(result);
      });
    });
  };

  api.favorites = {

    albums: function(tco_id, sort, next) {
      var sql = "SELECT album.id, album.name, " +
        "album.cover__c as cover, unique_id__c as tco_id " +
        "FROM salesforce.tco_favorite__c " +
        "INNER JOIN salesforce.tco_album__c as album " +
        "ON fav_album__c = album.sfid " +
        "INNER JOIN salesforce.tco__c " +
        "ON tco__c.sfid = album.tco__c " +
        "WHERE unique_id__c = $1";

      executeSql('album', sql, tco_id, sort, next);
    },

  };

  next();
};