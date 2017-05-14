'use strict';

// File that handles receiving check flight messages from api.ai

// My js dependencies
var logger = require('../util/logger');
var flightUtils = require('../util/flights');
var apiAiUtils = require('../util/apiAi');

module.exports = {

    /**
     * Performs the necessary actions for a check flight request from api.ai.
     */
    check: function (result, res, mode) {

        var followupEvent = '';
        var parameters = {};

        // Try to find an airport code
        var airportCodes = flightUtils.findAirportCode(result.resolvedQuery);

        // TODO check if airport code is actually valid

        if (airportCodes.length === 1) {
            // Found an airport code! Perfect data
            followupEvent = 'correct-' + mode + '-airport';
            parameters[mode + '-airport'] = airportCodes[0];
        } else {
            // Incorrect airport code, looks like we need to ask the user to redo
            followupEvent = 'redo-' + mode + '-airport';
        }

        // Send the response back with the event
        apiAiUtils.sendFulfillmentResponse(res, followupEvent, parameters);
    },

    /**
     * Given the api.ai result, will search for the correct flight.
     */
    search: function (result, res) {
        var followupEvent = '';

        // TODO set the reminder in the db
        // DEBUG
        if (false) {
            // Successfully set the reminder
            followupEvent = 'search-found-flight';

            // TODO data

        } else {
            // Cannot set reminder for this flight.
            // Determine event based on the existence of a time

            if (result.contexts[0].parameters.depart_time === '') {
                followupEvent = 'search-no-flight-no-time';
            } else {
                followupEvent = 'search-no-flight-yes-time';
            }
        }

        // Send the response back with the event
        apiAiUtils.sendFulfillmentResponse(res, followupEvent);

        if (followupEvent === 'search-no-flight-yes-time') {
            // Set up the reminders for the flight
            set(result, res, false);
        }
    },

    /**
     * Sets reminders for the flight given in the result from api.ai
     */
    set: function (result, res, respond) {
        // Respond with 200 if needed. Otherwise we already responded
        if (respond) {
            res.sendStatus(200);
        }

        // TODO
    }
};