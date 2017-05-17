'use strict';

// Used to process a request in natural language

// My js dependencies
var logger = require('../util/logger');
var apiAi = require('../util/apiAi');
var fbMessenger = require('../util/fbMessenger');

module.exports = {
    /**
     * Routes a message to the proper service depending on the type.
     */
    route: function (uid, message) {

        if (message.quick_reply && message.quick_reply.payload !== '#IGNORE') {
            // Handle non-ignored quick replies

            var action = message.quick_reply.payload;
            // TODO

        } else if (message.text) {
            // Handle plain text
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
            apiAi.onApiAiResponse(uid, response);
        }

        /**
         * Callback for when api.ai responds with an error (it might be down)
         */
        function onApiAiError(error) {
            apiAi.onApiAiError(uid, error);
        }

    }
};