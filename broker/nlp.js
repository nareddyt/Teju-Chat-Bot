'use strict';

// My js dependencies
var logger = require('../util/logger');
var apiAi = require('../util/apiAi');
var fbMessenger = require('../util/fbMessenger');

/**
 * Forwards the messages to api.ai based on the message type.
 */
function forwardToApiAi(uid, message) {

    if (message.text) {
        apiAi.sendText(message.text, uid, onApiAiResponse, onApiAiError);
    } else {
        logger.log('warn', 'message does not contain text, not handling it');
        // TODO stickers
        // TODO emojis?
        // TODO WELCOME event
    }

    /**
     * Callback for when api.ai responds with a text message to send back to the user
     */
    function onApiAiResponse(response) {
        // Send that message to the user!
        fbMessenger.sendTextMessage(uid, response.result.fulfillment.speech);
    }

    /**
     * Callback for when api.ai responds with an error (it might be down)
     */
    function onApiAiError(error) {
        // Notify the user
        logger.log('error', 'api.ai seems to be down right now');
        logger.log('error', error);
        fbMessenger.sendTextMessage(uid, 'Uh oh. Seems like the language processing service is down right now... Try again later');
    }

}

module.exports = forwardToApiAi;
