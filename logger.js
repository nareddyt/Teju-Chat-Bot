'use strict';

var winston = require('winston');

function log(level, message) {
    winston.log(level, message + ' ---', {pid: process.pid});
}

module.exports = log;
