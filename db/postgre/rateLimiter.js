'use strict';

var pg = require('pg');

// Instantiate a new client
var client;
if (process.env.DATABASE_URL) {
    client = new pg.Client(process.env.DATABASE_URL);
} else {
    client = new pg.Client();
}

module.exports = {
    setUp: function (callbackOnError, callbackOnEnd) {
        client.connect(function (err) {
            if (err) {
                // FIXME handler error properly
                throw err;
            }

            client.on('error', callbackOnError);
            client.on('end', callbackOnEnd);
        });
    },

    getUser: function (uid) {
        // TODO
    },

    retryOnError: function (err) {
        logger.log('error', err);
        // TODO
    },

    retryOnEnd: function (msg) {
        logger.log('error', msg);
        // TODO
    }
};