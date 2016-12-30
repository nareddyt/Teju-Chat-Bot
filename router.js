'use strict';

var express = require('express');
var logger = require('./util/logger');

var router = express.Router();

router.get('/', function (req, res, next) {
    logger.log('info', 'main');
    res.status(200).send('Yay!');
});

module.exports = router;
