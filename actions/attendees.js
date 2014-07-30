exports.attendeesList = {
  name:                   'attendeesList',
  description:            'Returns attendees list. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['tco_id'],
    optional: ['type','handle'],
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
    });
  }
};

exports.attendeeUnreadMessages = {
  name:                   'attendeeUnreadMessages',
  description:            'Returns attendee Unread Messages count. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['tco_id','attendee_id'],
    optional: [],
  },

  run: function(api, connection, next){
    api.attendees.getUnreadMessagesCount(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.likeAttendee = {
  name:                   'likeAttendee',
  description:            'Likes an attendee. Method: POST',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: [ 'tco_id', 'id' ],
    optional: [],
  },

  run: function(api, connection, next) {
    api.attendees.like(connection.params.tco_id, connection.params.id,
      function(data) {
        connection.response.response = data;
        connection.response.count = null;
        next(connection, true);
      }
    );
  }
};

exports.attendeeChallenges = {
  name:                   'attendeeChallenges',
  description:            "Returns attendee's current challenges. Method: GET",
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,  
  inputs: {
    required: ['tco_id','attendee_id'],
    optional: [],
  },

  run: function(api, connection, next){
    api.attendees.getChallenges(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};
