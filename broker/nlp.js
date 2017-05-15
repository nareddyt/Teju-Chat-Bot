'use strict';

// Used to process a request in natural language

// My js dependencies
var logger = require('../util/logger');
var apiAi = require('../util/apiAi');
var fbMessenger = require('../util/fbMessenger');

/**
 * Forwards the messages to api.ai based on the message type.
 */
function forwardToApiAi(uid, message) {

    if (message.text) {
        apiAi.sendTextQuery(message.text, uid, onApiAiResponse, onApiAiError);
    } else {
        // TODO stickers
        // TODO emojis?
        // TODO WELCOME event
        logger.log('warn', 'message does not contain text, not handling it');
        fbMessenger.sendTextMessage(uid, 'Sorry, I can only handle text messages :(');
    }

    /**
     * Callback for when api.ai responds with a text message to send back to the user
     */
    function onApiAiResponse(response) {
        // Send that message(s) to the user!
        var cache = [];

        // Loop through all the messages
        var messages = response.result.fulfillment.messages;
        for (var i = 0; i < messages.length; i++) {
            var message = messages[i];

            // Make sure to check if we already sent it (as messages duplicate sometimes)
            if (!(message in cache)) {
                cache.push(message);

                if (message.speech) {
                    // Is a text message, send as normal
                    fbMessenger.sendTextMessage(uid, message.speech);
                } else {
                    // Handle custom payloads here
                    if (message.client === 'facebook-messenger') {
                        fbMessenger.sendCustomPayload(uid, message);
                    } else {
                        logger.log('warn', 'api.ai responded to unsupported client' + message.client);
                    }
                }
            }
        }
    }

    /**
     * Callback for when api.ai responds with an error (it might be down)
     */
    function onApiAiError(error) {
        // Notify the user
        logger.log('error', 'api.ai seems to be down right now');
        logger.log('error', error);
        fbMessenger.sendTextMessage(uid, 'My bad, it seems like something is down :O');
    }

}

module.exports = forwardToApiAi;
