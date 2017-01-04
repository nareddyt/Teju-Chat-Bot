'use strict';

// This file contains HTTP routes

// NPM dependencies
var express = require('express');

// My js dependencies
var verifyFbWebhook = require('./../broker/verifyWebhook');
var handleUserMessage = require('./../broker/userRequest');
var handlePing = require('../ping/ping');

// Set up the router
var router = express.Router();

// Handles FB webhook registration
router.get('/broker', verifyFbWebhook);

// Handles FB Messenger message from user
router.post('/broker', handleUserMessage);

// Handles pings
router.get('/ping', handlePing);

module.exports = router;
