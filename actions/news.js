exports.news = {
  name:                   'news',
  description:            'Returns a single News object. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id', 'id' ],
    optional: [],
  },

  run: function(api, connection, next){
    api.news.get(connection.params.tco_id, connection.params.id,
      function(data){
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};

exports.newsList = {
  name:                   'newsList',
  description:            'Returns all News objects. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id' ],
    optional: [ 'source', 'start_time' ],
  },

  run: function(api, connection, next){
    api.news.list(connection.params.tco_id,
      connection.params.source,
      connection.params.start_time,
      function(data){
        connection.response.response = data;
        connection.response.count = data.length;
        next(connection, true);
      }
    );
  }
};