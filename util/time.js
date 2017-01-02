'use strict';

// This file contains time-related functions

// Npm dependency
var moment = require('moment');

module.exports = {
    /**
     * Standardized timestamp being used across the service.
     */
    getCurrTimeInt: function () {
        return moment().format('YYYYMMDDHHmmss');
    }
};