exports.attendeesList = {
  name:                   'attendeesList',
  description:            'Returns attendees list. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['tco_id'],
    optional: ['type'],
  },

  run: function(api, connection, next){
    api.attendees.list(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.attendee = {
  name:                   'attendee',
  description:            'Returns attendee participating in tco. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['tco_id','id'],
    optional: [],
  },

  run: function(api, connection, next){
    api.attendees.get(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};