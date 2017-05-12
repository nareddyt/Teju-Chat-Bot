'use strict';

// File that contains the api.ai webhook handler

// NPM dependencies
var basicAuth = require('basic-auth');

// My js dependencies
var logger = require('../util/logger');
var flightRequest = require('../flights/userRequest');

module.exports = {
    /**
     * Checks for basic authentication on request from api.ai
     */
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

    /**
     * If basic auth passes, fulfills the request.
     */
    fulfill: function (req, res) {
        var result = req.body.result;
        var action = result.action;

        if (action === 'check_airport') {
            flightRequest.check(result, res);
        } else if (action === 'set_flight_reminder') {
            flightRequest.set(result, res);
        } else {
            logger.log('warn', 'fulfill call with undefined action:', action);
            res.sendStatus(200);
        }
    }
};