exports.tcosList = {
  name:                   'tcosList',
  description:            'Returns all tco records. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [],
    optional: [],
  },

  run: function(api, connection, next){
    api.tcos.list(function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.tco = {
  name:                   'tco',
  description:            'Returns a single tco record. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['id'],
    optional: [],
  },

  run: function(api, connection, next){
    api.tcos.get(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};