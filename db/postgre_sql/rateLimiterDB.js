'use strict';

var pg = require('pg');
var logger = require('../../util/logger');

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
                logger.log('error', 'error on connect!');
                throw err;
            }

            logger.log('info', 'postgre sql connected!');

            client.on('error', callbackOnError);
            client.on('end', callbackOnEnd);
        });
    },

    getUser: function (uid, callback) {
        client.query('SELECT * FROM users WHERE uid=' + uid + '', callback)
    },

    createUser: function (uid, callback) {
        client.query('INSERT INTO users (uid) VALUES (' + uid + ')', callback);
    },

    retryOnError: function (err) {
        logger.log('error', err);
        throw err;
        // TODO
    },

    retryOnEnd: function (msg) {
        logger.log('error', msg);
        throw msg;
        // TODO
    }
};