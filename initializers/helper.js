var Q = require("q");

exports.helper = function(api, next){

  api.helper = {
    createDeferedConnection: function(client) {
      var deferred = Q.defer();
      client.connect(function(err) {
        if (err) deferred.reject({message : "Error: no connection to postgres database"});
        if (!err) deferred.resolve();
      });
      return deferred.promise;
    },

    createDeferedQuery: function (client, sql, params) {
      var deferred = Q.defer();
      client.query(sql, params, function(err, rs) {
        if (err) deferred.reject({message : "Error: Error during query", details: err});
        if (!err) deferred.resolve(rs);
      });
      return deferred.promise;
    }
  }

  next();
}

