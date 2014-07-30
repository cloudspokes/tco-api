var util = require('util');

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
        next(connection, true);
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