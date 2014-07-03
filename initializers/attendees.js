var pg = require('pg').native;

exports.attendees = function(api, next){

  api.attendees = {

    list: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "select salesforce.tco_attendee__c.id as id, "+
        "unique_id__c as tco_id, handle__c as handle,"+
        "salesforce.tco_attendee__c.name, avatar__c as avatar,"+
        "type__c as type, email__c as email,"+
        "country__c as country,quote__c as quote,"+
        "to_char(member_since__c,'YYYY-MM-DD') as member_since,"+
        "current_challenges__c as current_challenges from salesforce.tco__c "+
        "inner join salesforce.tco_attendee__c"+
        " on salesforce.tco_attendee__c.tco__c = salesforce.tco__c.sfid"+
        " where salesforce.tco__c.unique_id__c = '"+params.tco_id+"' ";

        if(params.type) sql += " AND type__c='"+ params.type +"' ";
        if(params.handle) sql += " AND handle__c='" + params.handle + "'";
        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        })
      })
    },


    get: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "select salesforce.tco_attendee__c.id as id, "+
        "unique_id__c as tco_id, handle__c as handle,"+
        "salesforce.tco_attendee__c.name, avatar__c as avatar,"+
        "type__c as type, email__c as email,"+
        "country__c as country,quote__c as quote,"+
        "to_char(member_since__c,'YYYY-MM-DD') as member_since,"+
        "current_challenges__c as current_challenges from salesforce.tco__c "+
        "inner join salesforce.tco_attendee__c"+
        " on salesforce.tco_attendee__c.tco__c = salesforce.tco__c.sfid"+
        " where salesforce.tco__c.unique_id__c = '"+params.tco_id+"' "+
        " AND salesforce.tco_attendee__c.id = '"+params.id+"'";

        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        })
      })
    },

    getUnreadMessagesCount: function(params,next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "select COUNT(*) from salesforce.tco_private_message__c "+
        "inner join salesforce.tco_attendee__c"+
        " on salesforce.tco_attendee__c.sfid = salesforce.tco_private_message__c.to_attendee__c"+
        " inner join salesforce.tco__c"+
        " on salesforce.tco__c.sfid = salesforce.tco_private_message__c.tco__c"+
        " where salesforce.tco_attendee__c.id = '"+params.attendee_id+"' "+
        " AND salesforce.tco__c.unique_id__c = '"+params.tco_id+"' "+
        " AND (salesforce.tco_private_message__c.status__c != 'read' "+
        " OR salesforce.tco_private_message__c.status__c IS NULL)";

        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        })
      })
    },

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
    },


    like: function(tco_id, id, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "INSERT INTO salesforce.tco_favorite__c(type__c, fav_attendee__c)" +
          " SELECT 'Attendee', attendee.sfid" +
          " FROM salesforce.tco_attendee__c as attendee" +
          " INNER JOIN salesforce.tco__c as tco" +
          " ON tco.sfid = attendee.tco__c" +
          " WHERE unique_id__c = $1 AND attendee.id = $2";
        client.query(sql, [ tco_id, id ], function(err, rs) {
          if (err) next(err);
          if (!err) next(rs);
        });
      });
    },

    getChallenges: function(params, next) {
      var client = new pg.Client(api.config.general.pg.connString);
      client.connect(function(err) {
        var sql = "SELECT events.id as id, tcos.unique_id__c as tco_id, " +
          "events.name as name, events.start_time__c as start_time, "+
          "events.end_time__c as end_time, events.contest_type__c as contest_type, "+
          "events.contest_purse__c || '$' as contest_purse, "+
          "events.contest_points__c as contest_points "+
          "FROM salesforce.tco_event__c as events inner join "+
          "salesforce.tco__c as tcos on tcos.sfid = events.tco__c "+
          "inner join salesforce.tco_attendee__c as attendees on attendees.tco__c = tcos.sfid "+
          "inner join salesforce.tco_event_participant__c as participants "+
          "on participants.attendee__c = attendees.sfid AND participants.event__c = events.sfid "+
          " where tcos.unique_id__c = '" + params.tco_id + "' AND attendees.id = '" + params.attendee_id + "'"; 
        client.query(sql, function(err, rs) {
          if (err) next(err);
          if (!err) next(rs['rows']);
        });
      });
    }    
  }

  next();

};
