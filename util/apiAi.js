'use strict';

// Common functionality for api.ai calls

// Npm dependencies
var apiAi = require('apiai');
var sleep = require('system-sleep');

// My js dependencies
var logger = require('../util/logger');
var fbMessenger = require('../util/fbMessenger');

// Set up the api.ai app
var app = apiAi(process.env.API_AI_TOKEN);

module.exports = {

    /**
     * Sends a text request to api.ai
     */
    sendTextQuery: function (msg, uid, callback, callbackOnError) {
        // Set up the options with the session id
        var options = {
            sessionId: uid
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
     * Sends an event to api.ai
     */
    sendEventQuery: function (event_name, parameters, uid, callback, callbackOnError) {
        // Set up the options with the session id
        var options = {
            sessionId: uid
        };

        // Create event json
        var event = {
            name: event_name
        };
        if (parameters) {
            var size = Object.keys(parameters).length;
            if (size > 0) {
                event['data'] = parameters;
            }
        }

        // Create the request
        var request = app.eventRequest(event, options);

        // Set up the callbacks
        request.on('response', callback);
        request.on('error', callbackOnError);

        // Send the request to api.ai!
        request.end();
    },

    /**
     * Sends an reset contexts query to api.ai
     */
    resetContexts: function (uid, callback, callbackOnError) {
        // Set up the options with the session id
        var options = {
            sessionId: uid
        };

        // Create the request
        var request = app.deleteContextsRequest(options);

        // Set up the callbacks
        request.on('response', callback);
        request.on('error', callbackOnError);

        // Send the request to api.ai!
        request.end();
    },

    /**
     * Sends a fulfillment response with a followup back to api.ai
     */
    sendFollowupResponse: function (res, followupEvent, parameters) {
        var json = {};

        var event = {};
        event.name = followupEvent;
        json['followupEvent'] = event;

        if (parameters) {
            var size = Object.keys(parameters).length;
            if (size > 0) {
                event['data'] = parameters;
            }
        }

        res.json(json);
    },

    /**
     * Callback for when api.ai responds with a text message to send back to the user
     */
    onApiAiResponse: function (uid, response) {
        // Send that message(s) to the user!
        if (!response.result.fulfillment) {
            return;
        }

        // Loop through all the messages
        var messages = response.result.fulfillment.messages;
        for (var i = 0; i < messages.length; i++) {
            var message = messages[i];

            // Make sure this message is platform-independent
            if (!message.platform) {

                if (message.speech) {
                    // Is a text message, send as normal
                    fbMessenger.sendTextMessage(uid, message.speech);
                } else {
                    // Handle custom payloads here
                    fbMessenger.sendCustomPayload(uid, message.payload);
                }

                // Sleep to prevent out-of-order messages (kinda)
                sleep(100);
            }
        }
    },

    /**
     * Callback for when api.ai responds with an error (it might be down)
     */
    onApiAiError: function (uid, error) {
        // Notify the user
        logger.log('error', 'api.ai seems to be down right now');
        logger.log('error', error);
        fbMessenger.sendTextMessage(uid, 'My bad, it seems like something is down :O');
    }
};
