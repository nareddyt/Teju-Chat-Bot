'use strict';

// File that contains common error handling functions

// My js dependencies
var logger = require('./logger');

module.exports = {

    /**
     * Call to send an error message back to the client over HTTP.
     */
    sendErrorRes: function (err, req, res) {
        var message = err.status + ': ' + err.message;
        logger.log('warn', message);
        res.status(err.status || 500).send(message);
    }

};