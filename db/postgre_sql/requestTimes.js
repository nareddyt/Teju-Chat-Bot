'use strict';

var pg = require('pg');
var logger = require('../../util/logger');

// Instantiate a new client based on if it's being run locally or on heroku (kinda hacky)
var client;
if (process.env.DATABASE_URL) {
    client = new pg.Client(process.env.DATABASE_URL);
} else {
    client = new pg.Client();
}

module.exports = {

    setUp: function (callback, callbackOnError, callbackOnEnd) {
        client.connect(function (err) {
            callback(err);

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

    updateTime: function (uid, index, time, callback) {
        client.query('UPDATE users SET time_' + index + '=' + time + ' WHERE uid=' + uid, callback);
    }
};