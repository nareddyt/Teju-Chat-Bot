'use strict';

// My js dependencies
var logger = require('./logger');

module.exports = {

    handleError: function (err, req, res) {
        var message = err.status + ': ' + err.message;
        logger.log('warn', message);
        res.status(err.status || 500).send(message);
    }

};