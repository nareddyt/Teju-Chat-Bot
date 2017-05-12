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
        var contextOut = '';
        var followupEvent = '';

        // Try to find an airport code
        var airportCodes = flightUtils.findAirportCode(result.parameters.depart_airport);

        // TODO check if airport code is actually valid
        if (airportCodes.length === 1) {
            // Found an airport code! Perfect data
            displayText = 'Got it! Can you confirm if this is correct';
            followupEvent = 'correct-airport';
        } else {
            // Incorrect airport code, looks like we need to ask the user to redo
            displayText = 'That is not a valid airport code. Please enter the 3 letter word (eg: ATL)';
            followupEvent = 'redo-airport';
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