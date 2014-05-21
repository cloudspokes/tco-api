exports.action = {
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
