'use strict';

// Common functionality for api.ai calls

// Npm dependencies
var apiAi = require('apiai');

// My js dependencies
var logger = require('../util/logger');

// Set up the api.ai app
var app = apiAi(process.env.API_AI_TOKEN);

module.exports = {

    /**
     * Sends a text request to api.ai
     */
    sendTextQuery: function (msg, sessionId, callback, callbackOnError) {
        // Set up the options with the session id
        var options = {
            sessionId: sessionId
        };

        // Create the request
        var request = app.textRequest(msg, options);

        // Set up the callbacks
        request.on('response', callback);
        request.on('error', callbackOnError);

        // Send the request to api.ai!
        request.end();
    },

    /**
     * Sends a fulfillment response back to api.ai
     */
    sendFulfillmentResponse: function (res, speech, displayText, data, contextOut, followupEvent) {
        var json = {};
        // json['speech'] = speech;
        // json['displayText'] = displayText;
        // json['data'] = data;
        // json['contextOut'] = contextOut;
        // json['source'] = 'Teju-Bot fulfillment service';

        if (followupEvent) {
            var event = {};
            event.name = followupEvent;
            json['followupEvent'] = event;
        }

        res.json(json);
    }

};
