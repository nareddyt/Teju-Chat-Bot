'use strict';

// My js dependencies
var logger = require('../util/logger');
var security = require('../util/security');
var errorHandler = require('../util/errorHandler');

function messageReceived(req, res) {

    var sha1 = security.getSHA1WithAppSecret(JSON.stringify(req.body));
    if (process.env.NODE_ENV == 'development' || req.headers['x-hub-signature'] == 'sha1=' + sha1) {
        // Authenticated!

        parseJson(req, res);
    } else {
        // sha1 headers didn't match... uh oh

        logger.log('warn', 'post to broker with wrong sha1');
        res.status(403).send('You are not facebook, are you? pls stop >:(');
    }
}

function parseJson(req, res) {

    var entries = req.body.entry;

    if (req.body.object == 'page' && entries) {
        for (var i = 0; i < entries.length; i++) {
            var messaging_events = entries[i].messaging;

            if (messaging_events) {
                for (var j = 0; j < messaging_events.length; j++) {
                    var sender_uid = messaging_events[i].sender;
                    var message = messaging_events[i].message;

                    applyRateLimit(req, res, sender_uid, message);
                }
            }
        }
    }

    // Everything in the request is A-ok!
    res.sendStatus(200);
}

// FIXME this only works for text currently, not any quick actions
function applyRateLimit(req, res, uid, message) {
    // TODO


}

module.exports = messageReceived;