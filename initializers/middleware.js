// will eventually contain authentication
exports.middleware = function(api, next){

  api.middleware = {};

  api.middleware._start = function(api, next){
    next();
  };

  api.middleware._stop =  function(api, next){
    next();
  };

  next();
}