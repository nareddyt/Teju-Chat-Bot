'use strict';

// My js dependencies
var logger = require('../util/logger');

function verifyFBbWebhook(req, res) {

    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
        logger.log('info', 'fb webhook validated!');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        logger.log('warn', 'fb webhook registration failed, validation token is probably wrong');
        res.sendStatus(403);
    }

}

module.exports = verifyFBbWebhook;