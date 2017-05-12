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

        var speech = '';
        var displayText = '';
        var data = '';
        var contextOut = result.contexts;
        var followupEvent = '';

        if (!result.parameters.depart_airport) {
            // No airport code was mentioned, try to find it
            var airportCodes = flightUtils.findAirportCode(result.resolvedQuery);

            if (airportCodes.length === 1) {
                // Found an airport code! Change the context
                // TODO check if airport code is actually valid

                var code = airportCodes[0].toUpperCase();
                result.parameters.depart_airport = code;

                for (var i = 0; i < result.contexts.length; i++) {
                    var context = result.contexts[i];

                    if (context.name === 'remember-flight') {
                        context.parameters.depart_airport = code;
                        context.parameters['depart_airport.original'] = code;

                        var newContext = JSON.parse(JSON.stringify(context));
                        newContext.name = 'remember-flight-checked';
                        contextOut.push(newContext);
                    }
                }
            }
        }

        // Send the response back with the context (might be changed above!)
        apiAiUtils.sendFulfillmentResponse(res, speech, displayText, data, contextOut, followupEvent);
    },

    /**
     * Performs the necessary actions for a set flight request from api.ai.
     */
    set: function (result, res) {
        // TODO
    }
};