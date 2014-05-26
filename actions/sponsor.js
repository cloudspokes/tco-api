exports.sponsor = {
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
    api.sponsor.get(connection.params.tco_id, connection.params.id,
      function(data){
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};