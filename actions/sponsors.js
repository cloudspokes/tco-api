exports.sponsors = {
  name:                   'sponsor',
  description:            'Returns a single Sponsor object. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id', 'id' ],
    optional: [],
  },

  run: function(api, connection, next){
    api.sponsors.get(connection.params.tco_id, connection.params.id,
      function(data){
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};

exports.sponsorsList = {
  name:                   'sponsorsList',
  description:            'Returns all Sponsor objects. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [],
    optional: [],
  },

  run: function(api, connection, next){
    api.sponsors.list(function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};