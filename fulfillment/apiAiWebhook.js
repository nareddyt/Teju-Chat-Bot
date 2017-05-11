'use strict';

// File that contains the api.ai webhook handler

// NPM dependencies
var basicAuth = require('basic-auth');

// My js dependencies
var logger = require('../util/logger');

module.exports = {
    auth: function (req, res, next) {

        function unauthorized(res) {
            logger.log('warn', 'unauthorized access to fulfillment service');
            res.setHeader('WWW-Authenticate', 'Basic realm=Teju-Bot Fulfillment');
            return res.sendStatus(401);
        }

        var user = basicAuth(req);
        if (!user || !user.name || !user.pass) {
            return unauthorized(res);
        }

        if (user.name === process.env.FULFILLMENT_USERNAME && user.pass === process.env.FULFILLMENT_PASSWORD) {
            return next();
        } else {
            return unauthorized(res);
        }
    },

    fulfill: function (req, res, next) {
        // TODO
        res.sendStatus(500);
    }
};