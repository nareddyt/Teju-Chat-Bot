'use strict';

// File that handles receiving check flight messages from api.ai

// My js dependencies
var logger = require('../util/logger');
var flightUtils = require('../util/flights');
var apiAiUtils = require('../util/apiAi');
var fbMessenger = require('../util/fbMessenger');

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
            parameters[mode + '-airport'] = airportCodes[0].toUpperCase();
        } else {
            // Incorrect airport code, looks like we need to ask the user to redo
            followupEvent = 'redo-' + mode + '-airport';
        }

        // Send the response back with the event
        apiAiUtils.sendFollowupResponse(res, followupEvent, parameters);
    },

    /**
     * Given the api.ai result, will search for the correct flight. Note this happens async with the processing event
     */
    search: function (result, res) {

        // Send the response back with the event
        apiAiUtils.sendFollowupResponse(res, 'processing');

        // TODO perform real search
        var matches = [];

        // DEBUG
        if (matches.length > 0) {
            // Successfully found some matching flights

            // TODO display flights via messenger

            // Note that we do not send an api.ai response here.
            // We only do that after the user selects a flight in the broker layer

        } else {
            // Cannot find the flight data, but still set the reminder.
            // Send event to api.ai
            var event = 'search-no-flight';
            apiAiUtils.sendEventQuery(event)
        }
    },

    /**
     * Sets reminders for the flight given in the result from api.ai
     */
    set: function (result, res) {
        // Respond instantaneously that the flight reminder is set
        apiAiUtils.sendFollowupResponse(res, 'flight-reminder-set')

        // TODO actually set the reminders
    }
};