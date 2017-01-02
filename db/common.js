'use strict';

var requestTimesDb = require('./postgre_sql/requestTimes');

module.exports = {
    setUp: function () {
        requestTimesDb.setUp(requestTimesDb.retryOnError, requestTimesDb.retryOnEnd);
        // TODO the other db
    }
};
