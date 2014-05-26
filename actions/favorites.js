exports.favoriteAlbums = {
  name:                   'favoriteAlbums',
  description:            'Returns all favorite albums. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id' ],
    optional: [ 'sort' ],
  },

  run: function(api, connection, next){
    api.favorites.albums(connection.params.tco_id,
      connection.params.sort,
      function(data){
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};

exports.favoriteAttendees = {
  name:                   'favoriteAttendees',
  description:            'Returns all favorite attendees. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id' ],
    optional: [ 'sort' ],
  },

  run: function(api, connection, next){
    api.favorites.attendees(connection.params.tco_id,
      connection.params.sort,
      function(data){
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};