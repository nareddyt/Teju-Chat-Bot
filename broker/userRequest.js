'use strict';

// My js dependencies
var logger = require('../util/logger');
var security = require('../util/security');
var errorHandler = require('../util/errorHandler');

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
                    var sender_uid = messaging_events[i].sender;
                    var message = messaging_events[i].message;

                    // FIXME make async for each message
                    applyRateLimit(req, sender_uid, message);
                }
            }
        }
    }
}

function applyRateLimit(req, uid, message) {
    // TODO

    logger.log('info', JSON.stringify(uid) + ' sent ' + JSON.stringify(message));
}

module.exports = messageReceived;