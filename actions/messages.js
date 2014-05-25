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