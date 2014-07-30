exports.signin = {
    name:                   'signin',
    description:            'Authenticates the user and establishes a session.',
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    inputs: {
      required: [ 'tco_id', 'email', 'password' ],
      optional: [],
    },

    authenticated:          false,
    run: function(api, connection, next) {
      api.signin.post(connection, function(connection, success, msg, user) {
        connection.response.success = success;
        connection.response.msg = msg;
        connection.response.user = user;
        next(connection, true);
      });
    }
};