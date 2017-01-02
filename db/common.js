'use strict';

var rl_db = require('./postgre_sql/rateLimiterDB');

module.exports = {
    setUp: function () {
        rl_db.setUp(rl_db.retryOnError, rl_db.retryOnEnd);;;;;
        // TODO the other db
    }
};
