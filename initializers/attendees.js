var pg = require('pg').native;

exports.attendees = function(api, next) {

  api.attendees = {

    isLiked: function(tco_id, id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT COUNT(*) as likes_count " +
          "FROM salesforce.tco_favorite__c as favorite " +
          "INNER JOIN salesforce.tco_attendee__c as attendee " +
          "ON favorite.fav_attendee__c = attendee.sfid " +
          "INNER JOIN salesforce.tco__c " +
          "ON tco__c.sfid = attendee.tco__c " +
          "WHERE unique_id__c = $1 AND attendee.id = $2";
        client.query(sql, [ tco_id, id ], function(err, rs) {
          if (err) next(err);
          if (!err) next({ liked: rs['rows'][0].likes_count > 0 });
        });
      });
    }

  };

  next();
};