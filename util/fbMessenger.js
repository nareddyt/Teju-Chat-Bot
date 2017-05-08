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
    sendTextMessage: function (uid, message, callbackOnError) {
        // Create the json body
        if (message === null || !message) {
            message = "My bad, I could not process your speech :O";
        }
        var body = '{"recipient": {"id": "' + uid + '"},"message": {"text": "' + message + '"}}';

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

};
