var express = require('express');
var log = require('./logger');

var router = express.Router();

router.get('/', function (req, res, next) {
    log('info', 'main');
    res.status(200).send('Yay!');
});

module.exports = router;
