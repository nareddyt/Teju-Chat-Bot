'use strict';

var requestTimesDb = require('./postgre_sql/requestTimes');
var logger = require('../util/logger');
var rateLimiter = require('../broker/rateLimter');

module.exports = {
    setUpPostgre: function () {

        // Only try to connect if the rate limiter is disabled, meaning there was an error connecting
        if (!rateLimiter.enabled) {
            requestTimesDb.setUp(callback, onError, onEnd);
        } else {
            logger.log('info', 'postgresql already connected!')
        }

        /**
         * Callback for when a connection is established with the db.
         */
        function callback(err) {
            if (err) {
                // Error accessing the db. Skip out on rate limiting
                logger.log('error', 'error on connect! skipping rate limiting :(');
                logger.log('error', err);
                rateLimiter.enabled = false;
            } else {
                logger.log('info', 'postgresql connected');
                rateLimiter.enabled = true;
            }
        }

        /**
         * Callback for when there is an error with the connection.
         */
        function onError(err) {
            logger.log('error', 'error');
            logger.log('error', err);
            rateLimiter.enabled = false;
        }

        /**
         * Callback for when the connection ends.
         */
        function onEnd() {
            logger.log('error', 'postgresql was disconnected');
            rateLimiter.enabled = false;
        }
    }
};
