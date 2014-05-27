exports.attendeeLiked = {
  name:                   'attendeeLiked',
  description:            'Returns if the attendee is liked or not. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id', 'id' ],
    optional: [],
  },

  run: function(api, connection, next) {
    api.attendees.isLiked(connection.params.tco_id, connection.params.id,
      function(data) {
        connection.response.response = data;
        connection.response.count = null;
        next(connection, true);
      }
    );
  }
};