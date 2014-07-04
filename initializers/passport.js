var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var pg = require('pg').native;

exports.passport = function(api, next) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
      },
      // Verify the credentials.
      function(email, password, next) {
        var user = { email: email };
        var client = new pg.Client(api.config.general.pg.connString);
        client.connect(function(err) {
          if (err) { return next(err); }
          var sql = "SELECT COUNT(1) FROM salesforce.tco_attendee__c WHERE email__c = $1 and password__c = $2";
          client.query(sql, [ email, password ], function(err, rs) {
            if (err) { return next(err); }
            if (!parseInt(rs.rows[0].count)) {
              return next(null, false, { message: 'Incorrect handle or password.' });
            }
            next(null, user);
          });
        });
      }
    ));

    passport.serializeUser(function (user, done) {
      // Faking a connection object as the first argument for
      // the session's save method. In this case it only needs
      // the connection id so it's safe to leave sparse
      api.session.save({id:user.connection_id}, user, function (err) {
        done(err, user.connection_id);
      });
    });

    passport.deserializeUser(function (connection_id, done) {
      // Faking a connection object as the first argument for
      // the session's load method. In this case it only needs
      // the connection id so it's safe to leave sparse
      api.session.load({id:connection_id}, function (err, user) {
        done(null, user);
      });
    });

    api.passport = passport;

    next();
};