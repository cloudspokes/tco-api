exports.signout = {
    name:                   'signout',
    description:            'Ends the user session.',
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    inputs: {
      required: [],
      optional: [],
    },

    run: function(api, connection, next) {
        api.session.delete(connection, next);
    }
};