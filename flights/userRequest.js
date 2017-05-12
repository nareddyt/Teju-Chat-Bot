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
    check: function (result, res) {
        // TODO

        if (!result.parameters.depart_airport) {
            // No airport code was mentioned, try to find it
            var airportCodes = flightUtils.findAirportCode(result.resolvedQuery);

            if (airportCodes.length === 1) {
                // Found an airport code! Change the context
                var code = airportCodes[0];
                result.parameters.depart_airport = code;

                for (var i = 0; i < result.contexts.length; i++) {
                    var context = result.contexts[i];
                    context.parameters.depart_airport = code;
                    context.parameters['depart_airport.original'] = code;
                }
            }

            // Send the response back with the context (might be changed above!)
            var speech = '';
            var displayText = 'Test';
            var data = '';
            var contextOut = result.contexts;
            var followupEvent = '';

            apiAiUtils.sendFulfillmentResponse(res, speech, displayText, data, contextOut, followupEvent);

        }


    },

    /**
     * Performs the necessary actions for a set flight request from api.ai.
     */
    set: function (result, res) {
        // TODO
    }
};