'use strict';

var rlDb = require('./postgre_sql/rateLimiterDB');

module.exports = {
    setUp: function () {
        rlDb.setUp(rlDb.retryOnError, rlDb.retryOnEnd);
        // TODO the other db
    }
};
