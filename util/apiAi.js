'use strict';

// Common functionality for api.ai calls

var apiAi = require('apiai');
var logger = require('../util/logger');

var app = apiAi(process.env.API_AI_TOKEN);

module.exports = {
    sendText: function (msg, sessionId, callback) {
        var options = {
            sessionId: sessionId
        };

        var request = app.textRequest(msg, options);

        request.on('response', callback);

        request.on('error', function (error) {
            logger.log('error', error);
            // TODO send message saying api.ai is not available
        });

        request.end();
    }
};
