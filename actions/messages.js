exports.messagesList = {
  name:                   'messagesList',
  description:            'Returns messages list. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['tco_id'],
    optional: ['from','to'],
  },

  run: function(api, connection, next){
    api.messages.list(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.deleteMessage = {
  name:                   'deleteMessage',
  description:            'Deletes a message object. Method: DELETE',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['tco_id','id'],
    optional: []
  },

  run: function(api, connection, next){
    api.messages.delete(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.message = {
  name:                   'message',
  description:            'Returns a single message. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id', 'id' ],
    optional: [],
  },

  run: function(api, connection, next){
    api.messages.get(connection.params.tco_id, connection.params.id,
      function(data){
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};
