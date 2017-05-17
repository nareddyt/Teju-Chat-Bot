'use strict';

// File that handles receiving check flight messages from api.ai

// My js dependencies
var logger = require('../util/logger');
var flightUtils = require('../util/flights');
var apiAi = require('../util/apiAi');
var fbMessenger = require('../util/fbMessenger');

module.exports = {

    /**
     * Performs the necessary actions for a check flight request from api.ai. Note this happens async with the processing event
     */
    checkAirport: function (uid, result, res, mode) {

        var event = '';
        var parameters = {};

        // Try to find an airport code
        var airportCodes = flightUtils.findAirportCode(result.resolvedQuery);

        // TODO check if airport code is actually valid

        if (airportCodes.length === 1) {
            // Found an airport code! Perfect data
            event = 'correct-' + mode + '-airport';
            parameters[mode + '-airport'] = airportCodes[0].toUpperCase();
        } else {
            // Incorrect airport code, looks like we need to ask the user to redo
            event = 'redo-' + mode + '-airport';
        }

        // Send the response back with the event
        apiAi.sendEventQuery(event, parameters, uid, onApiAiResponse, onApiAiError);

        /**
         * Callback for when api.ai responds with a text message to send back to the user
         */
        function onApiAiResponse(response) {
            apiAi.onApiAiResponse(uid, response);
        }

        /**
         * Callback for when api.ai responds with an error (it might be down)
         */
        function onApiAiError(error) {
            apiAi.onApiAiError(uid, error);
        }
    },

    /**
     * Given the api.ai result, will search for the correct flight. Note this happens async with the processing event
     */
    searchForPlane: function (uid, result, res) {

        // TODO perform real search
        var matches = [];

        // DEBUG
        if (matches.length > 0) {
            // Successfully found some matching flights

            // TODO display flights via messenger

            // Note that we do not send an api.ai response here.
            // We only do that after the user selects a flight, this happens in the broker layer

        } else {
            // Cannot find the flight data, but still set the reminder.
            // Send event to api.ai
            var event = 'search-no-flight';
            apiAi.sendEventQuery(event, {}, uid, onApiAiResponse, onApiAiError);
        }

        /**
         * Callback for when api.ai responds with a text message to send back to the user
         */
        function onApiAiResponse(response) {
            apiAi.onApiAiResponse(uid, response);
        }

        /**
         * Callback for when api.ai responds with an error (it might be down)
         */
        function onApiAiError(error) {
            apiAi.onApiAiError(uid, error);
        }
    },

    /**
     * Sets reminders for the flight given in the result from api.ai. Note this happens async with the processing event
     */
    setReminder: function (uid, result, res) {

        // TODO actually set the reminders

        // Send the reminder-set event to api.ai
        apiAi.sendEventQuery('flight-reminder-set', {}, uid, onApiAiResponse, onApiAiError);

        /**
         * Callback for when api.ai responds with a text message to send back to the user
         */
        function onApiAiResponse(response) {
            apiAi.onApiAiResponse(uid, response);
        }

        /**
         * Callback for when api.ai responds with an error (it might be down)
         */
        function onApiAiError(error) {
            apiAi.onApiAiError(uid, error);
        }
    }
};