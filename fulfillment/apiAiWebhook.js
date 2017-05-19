'use strict';

// File that contains the api.ai webhook handler

// NPM dependencies
var basicAuth = require('basic-auth');

// My js dependencies
var logger = require('../util/logger');
var flightRequest = require('./flights/userRequest');
var apiAiUtils = require('../util/apiAi');

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
        var uid = req.body.sessionId;
        var result = req.body.result;
        var action = result.action;

        // ASYNC: Send the response back with the event
        apiAiUtils.sendFollowupResponse(res, 'processing');

        // Determine correct method for the action
        if (action === 'check_depart_airport') {
            flightRequest.checkAirport(uid, result, 'depart');
        } else if (action === 'check_arrival_airport') {
            flightRequest.checkAirport(uid, result, 'arrival');
        } else if (action === 'search_for_flight') {
            flightRequest.searchForPlane(uid, result);
        } else if (action === 'set_flight_reminder') {
            flightRequest.setReminder(uid, result, null);
        } else if (action === 'reset_contexts') {

        } else {
            logger.log('warn', 'fulfill call with undefined action:', action);
            logger.log('warn', 'note that' + uid + 'is now in processing state');
        }
    }
};