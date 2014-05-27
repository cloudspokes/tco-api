exports.eventsList = {
  name: "eventsList",
  description: "Returns all event records for a tco. Method: GET",
  inputs: {
    required: ['tco_id'],
    optional: ['type', 'date'],
  },
  blockedConnectionTypes: [],
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    api.events.list(connection.params, function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.event = {
  name: "event",
  description: "Returns a single event object with all its details for a tco. Method: GET",
  inputs: {
    required: ['tco_id','id'],
    optional: [],
  },
  blockedConnectionTypes: [],
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    api.events.get(connection.params, function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.eventAttendees = {
  name: "eventAttendees",
  description: "Returns attendees list of an event in tco. Method: GET",
  inputs: {
    required: ['tco_id','id'],
    optional: [],
  },
  blockedConnectionTypes: [],
  outputExample: {},
  version: 1.0,
  run: function(api, connection, next){
    api.events.getAttendees(connection.params, function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};



