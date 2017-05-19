'use strict';

// File that handles fulfilling conversation requests from api.ai

// Npm dependencies
var sleep = require('system-sleep');

// My js dependencies
var logger = require('../../util/logger');
var apiAi = require('../../util/apiAi');
var fbMessenger = require('../../util/fbMessenger');

module.exports = {

    /**
     * Resets all contexts (used when a user says cancel)
     */
    resetContextsRequest: function (uid, result) {
        // Reset contexts
        apiAi.resetContexts(uid, onApiAiResponse, onApiAiError);

        // Sleep to prevent out-of-order messages
        sleep(100);

        // Let user know
        fbMessenger.sendTextMessage(uid, "Ok, cancelling.");

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