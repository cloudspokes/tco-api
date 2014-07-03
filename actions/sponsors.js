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
    required: [ 'tco_id' ],
    optional: [],
  },

  run: function(api, connection, next){
    api.sponsors.list(connection.params.tco_id, function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.applySponsor = {
  name:                   'applySponsor',
  description:            'Applies a sponsor. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id', 'id', 'attendee_id' ],
    optional: [ 'name' ],
  },

  run: function(api, connection, next){
    api.sponsors.apply(connection.params.id,
      connection.params.attendee_id,
      connection.params.name,
      function(data){
        connection.response.response = data;
        connection.response.count = null;
        next(connection, true);
      }
    );
  }
};