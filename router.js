'use strict';

var express = require('express');
var logger = require('./util/logger');

var router = express.Router();

// Handles FB webhook registration
router.get('/broker', function (req, res) {

    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
        logger.log('info', 'fb webhook validated!');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        logger.log('warn', 'fb webhook registration failed, validation token is probably wrong');
        res.sendStatus(403);
    }

});

module.exports = router;
