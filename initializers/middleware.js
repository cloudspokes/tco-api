exports.middleware = function(api, next) {

  //Set up session variables
  var setupSession = function (connection, actionTemplate, next) {
    connection.rawConnection.req.session = {passport: {user: connection.id}};
    next(connection, true);
  };

  //Init Passport and Passport's Session integration
  //(adds Passport methods/properties to the request and response objects)
  var usePassportMiddleware = function (connection, actionTemplate, next) {
    api.passport.initialize()(connection.rawConnection.req, connection.rawConnection.res, function () {
      api.passport.session()(connection.rawConnection.req, connection.rawConnection.res, function () {
        next(connection, true);
      });
    });
  };

  //Determine if Authentication is required,
  //Attempt login if credentials are supplied
  var doPassportAuthenticate = function (connection, actionTemplate, next) {
    // Do not try to authenticate if already logged in
    if (connection.rawConnection.req.isAuthenticated()) {
      return next(connection, true);
    }

    // Requires login
    if (!!actionTemplate.authenticated) {
       api.log("not yet authenticated, authorization required");
      // passport expects the credentials in a 'body' key inside of
      // the request object, we're fudging them in here.
      return api.signin.post(connection, next);
    }

    next(connection, true);
  };

  api.actions.preProcessors.push(setupSession);
  api.actions.preProcessors.push(usePassportMiddleware);
  api.actions.preProcessors.push(doPassportAuthenticate);

  next();
};