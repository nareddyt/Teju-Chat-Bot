'use strict';

// This handles the subscription of the facebook webhook

// My js dependencies
var logger = require('../util/logger');

/**
 * Verifies the facebook webhook as specified by the documentation.
 */
function verifyFBbWebhook(req, res) {

    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
        // Valid query from facebook!
        logger.log('info', 'fb webhook validated!');

        // Send back the challenge number send in the header
        res.status(200).send(req.query['hub.challenge']);
    } else {
        // Invalid subscription
        logger.log('warn', 'webhook validation failed with wrong verify token');
        res.status(403).send('You are not facebook, are you? pls stop >:(');
    }

}

module.exports = verifyFBbWebhook;