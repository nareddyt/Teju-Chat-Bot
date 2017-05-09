'use strict';

// File that schedules jobs to be run on set intervals

// My js dependencies
var dbs = require('../db/common');
var logger = require('../util/logger');

module.exports = {
    /**
     * Sets up all the functions to be scheduled.
     */
    setup: function () {
        // Attempt to connect with the postgre db every '5' minutes
        var postgress_reconnect_time_ms = process.env.POSTGRES_RECONNECT_TIME_MS;
        logger.log('info', 'scheduled setUpPostrgre at interval ' + postgress_reconnect_time_ms);
        setInterval(dbs.setUpPostgre, postgress_reconnect_time_ms);
    }
};