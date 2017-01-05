'use strict';

// This file handles receiving messages from fb messenger

// Npm dependencies
var validator = require('validator');

// My js dependencies
var logger = require('../util/logger');
var security = require('../util/security');
var errorHandler = require('../util/errorHandler');
var rateLimiter = require('./rateLimter');

/**
 * Checks the validity of the received postback (authentication with sha1).
 * Note: Doesn't check validity in "development" mode
 */
function messageReceived(req, res) {
    // Calculate the sha1 on the escaped unicode representation of the payload
    var sha1 = security.getSHA1WithAppSecret(security.toUnicode(JSON.stringify(req.body)));

    // Check this sha1 against the one sent in the header
    if (process.env.NODE_ENV == 'development' || req.headers['x-hub-signature'] == 'sha1=' + sha1) {
        // Authenticated!

        // Everything in the request is A-ok! Send back a 200 acknowledgement
        res.sendStatus(200);

        // Continue fulfilling the request
        parseJson(req);
    } else {
        // sha1 headers didn't match in production... uh oh

        logger.log('warn', 'post to broker with wrong sha1');
        res.status(403).send('You are not facebook, are you? pls stop >:(');
    }
}

/**
 * Retries the sender's uid and sent text from the payload.
 * Note: Batching may cause postbacks to contain multiple messages
 */
function parseJson(req) {

    var entries = req.body.entry;
    if (req.body.object == 'page' && entries) {
        // Payload is formatted correctly

        // Loop through each of the entries
        for (var i = 0; i < entries.length; i++) {
            var messaging_events = entries[i].messaging;
            if (messaging_events) {

                // Loop through each of the messages
                for (var j = 0; j < messaging_events.length; j++) {
                    // Retrieve the required values from the payload
                    var sender_uid = messaging_events[i].sender.id;
                    var message = messaging_events[i].message;

                    if (validator.isNumeric(sender_uid)) {
                        // FIXME make async for each message
                        // Continue by sending to the Rate Limiter
                        rateLimiter.useRateLimiting(sender_uid, message);
                    } else {
                        logger.log('warn', 'validator failed: ' + req);
                    }
                }
            }
        }
    }
}

module.exports = messageReceived;