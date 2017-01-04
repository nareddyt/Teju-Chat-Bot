'use strict';

var requestTimesDb = require('./postgre_sql/requestTimes');
var logger = require('../util/logger');
var rateLimiter = require('../broker/rateLimter');

module.exports = {
    setUp: function () {
        requestTimesDb.setUp(callback, onError, onEnd);

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

        function onError(err) {
            logger.log('error', 'error');
            logger.log('error', err);
            rateLimiter.enabled = false;
        }

        function onEnd() {
            logger.log('error', 'postgresql was disconnected');
            rateLimiter.enabled = false;
        }

        // TODO the other db
    }
};
