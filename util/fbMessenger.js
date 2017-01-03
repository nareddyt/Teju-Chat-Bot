'use strict';

// Common functionality for facebook messenger calls

// Npm dependencies
var https = require('https');

module.exports = {

    /**
     * Sends a text message to the user through facebook messenger.
     */
    sendTextMessage: function (uid, message) {
        // Create the json body
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

        // Post the body
        request.end(body)
    }

};