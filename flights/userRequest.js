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
            parameters[mode + '-airport'] = airportCodes[0].toUpperCase();
        } else {
            // Incorrect airport code, looks like we need to ask the user to redo
            followupEvent = 'redo-' + mode + '-airport';
        }

        // Send the response back with the event
        apiAiUtils.sendFollowupResponse(res, followupEvent, parameters);
    },

    /**
     * Given the api.ai result, will search for the correct flight.
     */
    search: function (result, res) {
        var followupEvent = '';
        var parameters = {};

        // TODO perform real search

        // DEBUG
        if (true) {
            // Successfully set the reminder
            followupEvent = 'search-found-flight';

            parameters['matched_flights'] = [];
            parameters['matched_flights_display'] = [];

            for (var i = 1; i <= 3; i++) {

                var flight = {};
                flight['name'] = 'hi';
                flight['number'] = i;
                parameters['matched_flights'].push(flight);

                var flight_display = {};
                flight_display['number'] = i;
                parameters['matched_flights_display'].push(flight_display);
            }

            // TODO data

        } else {
            // Cannot find the flight data, but still set the reminder
            followupEvent = 'search-no-flight';
        }

        // Send the response back with the event
        apiAiUtils.sendFollowupResponse(res, followupEvent, parameters);
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