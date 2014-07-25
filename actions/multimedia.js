exports.multimedia = {
  name:                   'multimedia',
  description:            'Returns a single Multimedia object. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  authenticated: true,
  inputs: {
    required: [ 'tco_id', 'album_id', 'id' ],
    optional: [],
  },

  run: function(api, connection, next){
    api.multimedia.get(connection.params.tco_id, connection.params.album_id,
      connection.params.id,
      function(data){
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};

exports.multimediaList = {
  name:                   'multimediaList',
  description:            'Returns a all Multimedia object. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  authenticated: true,
  inputs: {
    required: [ 'tco_id', 'album_id' ],
    optional: [],
  },

  run: function(api, connection, next){
    api.multimedia.list(connection.params.tco_id, connection.params.album_id,
      function(data){
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};

exports.postMultimedia = {
  name:                   'postMultimedia',
  description:            'Posts a Multimedia object. Method: POST',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  authenticated: true,
  inputs: {
    required: [ 'tco_id', 'album_id' ],
    optional: ['name', 'url'],
  },

  run: function(api, connection, next){
    api.multimedia.post(connection.params,
      function(data){
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};