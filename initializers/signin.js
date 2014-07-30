var util = require('util');
var pg = require('pg').native;

exports.signin = function(api, next) {

  var doBasicAuth = function (req, res, connection, next) {
    api.passport.authenticate("local", {session: true},
      function (err, user, msg, extra) {
      if (err) {
        connection.error = err;
        return next(connection, false);
      }

      if (!user) {
        // Unauthorized
        connection.rawConnection.responseHttpCode = 401;
        return next(connection, false, msg);
      }

      user.connection_id = connection.id;
      connection.rawConnection.req.logIn(user, function () {

        // pass back their user info. -- TODO move query to attendee initializer for reuse
        var client = new pg.Client(api.config.general.pg.connString);
        client.connect(function(err) {

        var sql = "select salesforce.tco_attendee__c.id as id, "+
        "unique_id__c as tco_id, handle__c as handle,"+
        "salesforce.tco_attendee__c.name, avatar__c as avatar,"+
        "type__c as type, email__c as email,"+
        "country__c as country from salesforce.tco__c"+
        " inner join salesforce.tco_attendee__c"+
        " on salesforce.tco_attendee__c.tco__c = salesforce.tco__c.sfid"+
        " where salesforce.tco_attendee__c.email__c = '"+user.email+"'";

          client.query(sql, function(err, rs) {
            if (err) next(err);
            if (!err) next(connection, true, 'Successfully logged in.', rs['rows'][0]);
          })
        })  
      });
    })(req, res);
  };

  api.signin = {
    post: function(connection, next) {
      return doBasicAuth(
        util._extend({body:connection.params},connection.rawConnection.req),
        connection.rawConnection.res,
        connection,
        next);
    }
  };

  next();
};