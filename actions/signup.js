exports.signUp = {
  name:                   'signUp',
  description:            'Registers an user as an attendee. Method: POST',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'username', 'password', 'email', 'handle'],
    optional: ['country', 'quote', 'avatar','display_name', 'first_name', 'last_name'],
  },

  run: function(api, connection, next){
    api.signup.post(connection.params,
      function(data){
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};