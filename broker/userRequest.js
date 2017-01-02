'use strict';

// This file handles user messages from messenger to api.ai

// My js dependencies
var logger = require('../util/logger');
var security = require('../util/security');
var errorHandler = require('../util/errorHandler');
var time = require('../util/time');
var requestTimesDb = require('../db/postgre_sql/requestTimes');


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

                    logger.log('info', 'uid ' + sender_uid + ' sent ' + JSON.stringify(message));

                    // FIXME make async for each message
                    // Continue by sending to the Rate Limiter
                    getUserRequests(sender_uid, message);
                }
            }
        }
    }
}

/**
 * Get the last 5 timestamps the user has sent a message.
 */
function getUserRequests(uid, message) {
    // Async call to the database to get the info
    requestTimesDb.getUser(uid, getUserCallback);

    /**
     * Callback for when we get the info from the db
     */
    function getUserCallback(err, result) {
        if (err) {
            // FIXME
            throw err;
        }

        // Forward to the next function
        checkUserExists(uid, message, result);
    }


}

/**
 * Based on the results from the DB, checks if the user actually is in the DB.
 */
function checkUserExists(uid, message, result) {

    // Get the data we care about for the user
    var uidData = result.rows[0];

    if (uidData) {
        // User exists already! Move on to the rate limit calculation
        calculateRateLimit(uid, message, uidData)
    } else {
        // Async call to add the user to the DB
        requestTimesDb.createUser(uid, createUserCallback);
    }

    /**
     * Callback for when the user is added to the DB
     */
    function createUserCallback(err, result) {
        if (err) {
            // FIXME
            throw err;
        }

        // Go back and query the DB for the default values of the user we just added
        getUserRequests(uid, message);
    }
}

function calculateRateLimit(uid, message, uidData) {
    logger.log('info', uidData);


}

function enqueue(uid, message) {
    // TODO aws sqs

    // TODO handle non-text messages
    if (message.text) {
        forwardToApiAi(uid, message);
    } else {
        logger.log('warn', 'message does not contain text, not handling it');
    }
}

function forwardToApiAi(uid, message) {
    // TODO
}

module.exports = messageReceived;