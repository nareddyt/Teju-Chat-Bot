'use strict';

// My js dependencies
var logger = require('../util/logger');

function messageReceived(req, res) {

    if (req.headers['x-hub-signature'] == 'sha1=' + process.env.FB_APP_SECRET_SHA1) {
        // Authenticated

        // TODO
        res.sendStatus(200);

    } else {
        res.status(403).send('Ok, you are not facebook..... stop it pls');
    }
}

module.exports = messageReceived;