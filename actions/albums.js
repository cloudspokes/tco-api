exports.album = {
  name:                   'album',
  description:            'Returns a single TCO Album. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id', 'id' ],
    optional: [],
  },

  run: function(api, connection, next) {
    api.albums.get(connection.params.tco_id, connection.params.id,
      function(data) {
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};

exports.albumsList = {
  name:                   'albumsList',
  description:            'Returns all TCO Albums. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id' ],
    optional: [],
  },

  run: function(api, connection, next) {
    api.albums.list(connection.params.tco_id, function(data) {
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.albumLiked = {
  name:                   'albumLiked',
  description:            'Returns if the album is liked or not. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id', 'id' ],
    optional: [],
  },

  run: function(api, connection, next) {
    api.albums.isLiked(connection.params.tco_id, connection.params.id,
      function(data) {
        connection.response.response = data;
        connection.response.count = null;
        next(connection, true);
      }
    );
  }
};