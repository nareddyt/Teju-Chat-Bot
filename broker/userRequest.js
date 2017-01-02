'use strict';

// My js dependencies
var logger = require('../util/logger');
var security = require('../util/security');
var errorHandler = require('../util/errorHandler');
var time = require('../util/time');
var rlDb = require('../db/postgre_sql/rateLimiterDB');

function messageReceived(req, res) {

    var sha1 = security.getSHA1WithAppSecret(security.toUnicode(JSON.stringify(req.body)));
    if (process.env.NODE_ENV == 'development' || req.headers['x-hub-signature'] == 'sha1=' + sha1) {
        // Authenticated!

        // Everything in the request is A-ok!
        res.sendStatus(200);

        // Continue fulfilling the request
        parseJson(req);
    } else {
        // sha1 headers didn't match in production... uh oh

        logger.log('warn', 'post to broker with wrong sha1');
        res.status(403).send('You are not facebook, are you? pls stop >:(');
    }
}

function parseJson(req) {

    var entries = req.body.entry;

    if (req.body.object == 'page' && entries) {
        for (var i = 0; i < entries.length; i++) {
            var messaging_events = entries[i].messaging;

            if (messaging_events) {
                for (var j = 0; j < messaging_events.length; j++) {
                    var sender_uid = messaging_events[i].sender.id;
                    var message = messaging_events[i].message;

                    logger.log('info', 'uid ' + sender_uid + ' sent ' + JSON.stringify(message));

                    // FIXME make async for each message
                    getRl(sender_uid, message);
                }
            }
        }
    }
}

function getRl(uid, message) {
    // Get the user rate limit info
    rlDb.getUser(uid, getRlCallback);

    function getRlCallback(err, result) {
        if (err) {
            // FIXME
            throw err;
        }

        checkRl(uid, message, result);
    }


}

function checkRl(uid, message, result) {

    var uidData = result.rows[0];
    if (uidData) {
        applyRl(uid, message, uidData)
    } else {
        rlDb.createUser(uid, checkRlCallback);
    }

    function checkRlCallback(err, result) {
        if (err) {
            // FIXME
            throw err;
        }

        getRl(uid, message);
    }
}

function applyRl(uid, message, uidData) {
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