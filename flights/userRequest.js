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

        // Try to find an airport code
        var airportCodes = flightUtils.findAirportCode(result.parameters.depart_airport);

        // TODO check if airport code is actually valid
        if (airportCodes.length === 1) {
            // Found an airport code! Perfect data
            followupEvent = 'correct-' + mode + '-airport';
        } else {
            // Incorrect airport code, looks like we need to ask the user to redo
            followupEvent = 'redo-' + mode + '-airport';
        }

        // Send the response back with the event
        apiAiUtils.sendFulfillmentResponse(res, followupEvent);
    },

    /**
     * Given the api.ai result, will search for the correct flight.
     */
    search: function (result, res) {
        var followupEvent = '';

        // TODO set the reminder in the db
        if (true) {
            // Successfully set the reminder
            followupEvent = 'search-found-flight';

            // TODO data

        } else {
            // Cannot set reminder for this flight
            followupEvent = 'search-no-flight';
        }

        // Send the response back with the event
        apiAiUtils.sendFulfillmentResponse(res, followupEvent);
    }
};