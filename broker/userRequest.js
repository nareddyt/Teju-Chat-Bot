'use strict';

// This file handles user messages from messenger to api.ai

// My js dependencies
var logger = require('../util/logger');
var security = require('../util/security');
var errorHandler = require('../util/errorHandler');
var time = require('../util/time');
var requestTimesDb = require('../db/postgre_sql/requestTimes');
var apiAi = require('../util/apiAi');
var fbMessenger = require('../util/fbMessenger');


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
        logger.log('info', 'uid=' + uid + ' is new!');
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

/**
 * Calculates whether the user has to be rate limited and updates the dbs.
 */
function calculateRateLimit(uid, message, uidData) {
    // Max allowed time between max and min
    var limitTime = process.env.MAX_TIME_FOR_RATE_LIMIT;

    // Calculate the min and max request times over the 5 period interval
    var minTime = Math.min(uidData.time_1, uidData.time_2, uidData.time_3, uidData.time_4, uidData.time_5);
    var maxTime = Math.max(uidData.time_1, uidData.time_2, uidData.time_3, uidData.time_4, uidData.time_5);

    // Do the check
    if (maxTime - minTime < limitTime) {

        // Apply rate limiting!
        logger.log('warn', 'rate limiting being applied for uid=' + uid);
        fbMessenger.sendTextMessage(uid, "Because you're spamming, I will not answer you anymore. Sorry :(");
        // TODO. Basic denial of service currently

    } else {

        // Set the correct time in the db
        var indexToUpdate;
        if (minTime == uidData.time_1) {
            indexToUpdate = 1;
        } else if (minTime == uidData.time_2) {
            indexToUpdate = 2;
        } else if (minTime == uidData.time_3) {
            indexToUpdate = 3;
        } else if (minTime == uidData.time_4) {
            indexToUpdate = 4;
        } else {
            indexToUpdate = 5;
        }

        requestTimesDb.updateTime(uid, indexToUpdate, time.getCurrTimeInt(), updateTimeCallback);
    }

    /**
     * Callback for when the user's request time is updated
     */
    function updateTimeCallback(err, result) {
        if (err) {
            // FIXME
            throw err;
        }

        // Continue on with the request
        forwardToApiAi(uid, message);


    }
}

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
        logger.log('error', error);
        fbMessenger.sendTextMessage(uid, 'Uh oh. Seems like the language processing service is down right now... Try again later');
    }

}

module.exports = messageReceived;