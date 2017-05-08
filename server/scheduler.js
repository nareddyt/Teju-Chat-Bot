'use strict';

// File that schedules jobs to be run on set intervals

// My js dependencies
var dbs = require('../db/common');

/**
 * Sets up all the functions to be scheduled.
 */
function setup() {
    // Attempt to connect with the postgre db every 5 minutes
    setInterval(dbs.setUpPostgre, 1000 * 5);
}

module.exports = setup;