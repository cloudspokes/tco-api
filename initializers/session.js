exports.session = function(api, next){

    api.session = {
        prefix: "__session:",
        duration: 60 * 60 * 1000, // 1 hour
    };

    api.session.save = function(connection, session, next){
        var key = api.session.prefix + connection.id.split("-")[0];
        api.cache.save(key, session, api.session.duration, function(error, new_flag){
            if(typeof next == "function"){ next(error); };
        });
    };

    api.session.load = function(connection, next){
        var key = api.session.prefix + connection.id.split("-")[0];
        api.cache.load(key, function(error, session, expireTimestamp, createdAt, readAt){
            if(typeof next == "function"){
                next(error, session, expireTimestamp, createdAt, readAt);
            }
        });
    };

    api.session.delete = function(connection, next){
        var key = api.session.prefix + connection.id.split("-")[0];
        api.cache.destroy(key, function(error, resp){
            if(typeof next == "function"){
                next(connection, error);
            }
        });
    };

    next();
};