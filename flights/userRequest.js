'use strict';

// File that handles receiving check flight messages from api.ai

// My js dependencies
var logger = require('../util/logger');
var flightUtils = require('../util/flights');

module.exports = {

    /**
     * Performs the necessary actions for a check flight request from api.ai.
     */
    check: function (result, res) {
        // TODO

        if (!result.depart_airport) {
            // No airport code was mentioned, try to find it
            var airportCodes = flightUtils.findAirportCode(result.resolvedQuery);

            if (airportCodes.length === 1) {
                // TODO found an airport code! Change the context
            } else {
                // TODO no changes to the context
            }
        }
    },

    /**
     * Performs the necessary actions for a set flight request from api.ai.
     */
    set: function (result, res) {
        // TODO
    }
};