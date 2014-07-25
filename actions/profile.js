exports.profile = {
  name:                   'profile',
  description:            'Returns an attendee profile. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  authenticated: true,
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

exports.updateProfile = {
  name:                   'updateProfile',
  description:            'Updates an attendee profile. Method: PUT',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  authenticated: true,
  inputs: {
    required: ['id'],
    optional: ["name","email","country","quote","email"],
  },

  run: function(api, connection, next){
    api.profile.update(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.getProfileChallenges = {
  name:                   'getProfileChallenges',
  description:            'Gets challenges of an attendee. Method: PUT',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  authenticated: true,
  inputs: {
    required: ['id'],
    optional: [],
  },

  run: function(api, connection, next){
    api.profile.getChallenges(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};