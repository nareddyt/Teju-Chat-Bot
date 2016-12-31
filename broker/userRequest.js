'use strict';

// My js dependencies
var logger = require('../util/logger');
var security = require('../util/security');

function messageReceived(req, res) {

    var sha1 = security.getSHA1WithAppSecret(JSON.stringify(req.body));
    if (process.env.NODE_ENV == 'development' || req.headers['x-hub-signature'] == 'sha1=' + sha1) {
        // Authenticated!

        res.sendStatus(200);
    } else {
        // sha1 headers didn't match... uh oh

        res.status(403).send('You are not facebook, are you? pls stop >:(');
    }
}

module.exports = messageReceived;