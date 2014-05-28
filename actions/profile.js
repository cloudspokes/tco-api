exports.profile = {
  name:                   'profile',
  description:            'Returns an attendee profile. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['id'],
    optional: [],
  },

  run: function(api, connection, next){
    api.profile.get(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};