'use strict';

// File that contains common logging functions

// Npm dependencies
var winston = require('winston');

module.exports = {

    /**
     * Standard winston logging wrapper
     */
    log: function (level, message) {
        winston.log(level, message);
    }

};

