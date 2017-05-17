'use strict';

// Common functionality for facebook messenger calls

// Npm dependencies
var https = require('https');

// My js dependencies
var logger = require('./logger');

module.exports = {

    /**
     * Sends a text message to the user through facebook messenger.
     */
    sendTextMessage: function (uid, message) {
        // Create the json body
        if (message === null || !message) {
            logger.log('error', 'empty message from api.ai');
            message = "My bad, I could not process your message :O";
        }
        var body = '{"recipient": {"id": "' + uid + '"},"message": {"text": "' + message + '"}}';

        // Make the request
        makeRequest(body);
    },

    /**
     * Sends a custom payload to facebook messenger
     */
    sendCustomPayload: function (uid, payload) {
        // Error check
        if (payload === null || !payload) {
            logger.log('error', 'empty payload from api.ai');
            return;
        }

        // Start creating json response
        var body = '';

        // Split on message type
        if (payload.type === 'quick-reply') {
            body = '{"recipient": {"id": "' + uid + '"}, "message":' + JSON.stringify(payload.message) + '}';
        } else if (payload.type === 'sender-action') {
            body = '{"recipient": {"id": "' + uid + '"}, "sender_action":' + JSON.stringify(payload.sender_action) + '}';
        } else {
            logger.log('warn', 'unsupported payload type to facebook' + payload.type);
            return;
        }

        // Make the request
        makeRequest(body);
    }
};

/**
 * POSTs the body to facebook to send's send api
 */
function makeRequest(body) {
    // Set up the POST data
    var options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: '/v2.6/me/messages?access_token=' + process.env.FB_PAGE_ACCESS_TOKEN,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };

    // Make the request
    var request = new https.request(options);

    // Set up the error handler
    request.on('error', function (err) {
        // Log the error. Nothing we can really do about it...
        logger.log('error', 'facebook messenger seems to be down right now');
        logger.log('error', err);
    });

    // Post the body
    request.end(body)
}
