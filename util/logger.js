'use strict';

var winston = require('winston');

module.exports = {

    log: function (level, message) {
        winston.log(level, message);
    }

};

