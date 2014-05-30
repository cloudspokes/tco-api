exports.eventNotificationsCount = {
  name:                   'eventNotificationsCount',
  description:            'Retrieves the count of events user is subscribed to for notifications. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['id'],
    optional: [],
  },

  run: function(api, connection, next){
    api.eventNotifications.getCount(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};

exports.eventNotificationsList = {
  name:                   'eventNotificationsList',
  description:            'Retrieves the events user is subscribed to for notifications. Method: GET',
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  inputs: {
    required: ['id'],
    optional: [],
  },

  run: function(api, connection, next){
    api.eventNotifications.list(connection.params,function(data){
      connection.response.response = data;
      connection.response.count = data.length;
      next(connection, true);
    });
  }
};