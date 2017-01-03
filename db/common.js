'use strict';

var requestTimesDb = require('./postgre_sql/requestTimes');
var logger = require('../util/logger');

module.exports = {
    setUp: function () {
        requestTimesDb.setUp(retryOnError, retryOnEnd);
        // TODO the other db

        function retryOnError(err) {
            logger.log('error', err);
            throw err;
            // TODO
        }

        function retryOnEnd(msg) {
            logger.log('error', msg);
            throw msg;
            // TODO
        }
    }
};
