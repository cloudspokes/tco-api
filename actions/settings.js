exports.getSettings = {
  name:                   'getSettings',
  description:            'Returns all attendee\'s settings. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['id'],
    optional: [],
  },

  run: function(api, connection, next){
    api.settings.get(connection.params.id, function(data) {
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    }).fail(function(err) {
      connection.rawConnection.responseHttpCode = 500;
      connection.response.error = err;
      next(connection, true);
    })
  }
};

exports.updateSettings = {
  name:                   'updateSettings',
  description:            'Updates all attendee\'s settings. Method: POST',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['id', 'eventPushNotifications', 'allowPrivateMessages'],
    optional: [],
  },

  run: function(api, connection, next){
    api.settings.put(connection.params, function(data) {
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    }).fail(function(err) {
      connection.rawConnection.responseHttpCode = 500;
      connection.response.error = err;
      next(connection, true);
    })
  }
};
