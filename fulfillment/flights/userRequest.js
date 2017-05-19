'use strict';

// File that handles fulfilling flight-related messages from api.ai

// Npm dependencies
var sleep = require('system-sleep');

// My js dependencies
var logger = require('../../util/logger');
var flightUtils = require('../../util/flights');
var apiAi = require('../../util/apiAi');
var fbMessenger = require('../../util/fbMessenger');

module.exports = {

    /**
     * Performs the necessary actions for a check flight request from api.ai. Note this happens async with the processing event
     */
    checkAirport: function (uid, result, mode) {

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
    searchForPlane: function (uid, result) {

        // TODO perform real search
        var matches = [];
        var flight1 = {
            depart_date: "2017-05-23",
            depart_time: "8:00",
            depart_airport: "ATL",
            arrivals: [
                {
                    date: "2017-05-23",
                    time: "10:00",
                    airport: "BAL"
                },
                {
                    date: "2017-05-23",
                    time: "14:00",
                    airport: "BOS"
                }
            ],
            airline: "Delta Air Lines",
            flight_number: "WN1830"
        };
        matches.push(flight1);

        if (matches.length > 0) {
            // Successfully found some matching flights

            // Display flights via messenger
            for (var i = 0; i < matches.length; i++) {
                var flight = matches[i];

                var flight_route = '';
                var flight_times = '';

                flight_route += flight.depart_airport;
                for (var j = 0; j < flight.arrivals.length; j++) {
                    var arrival = flight.arrivals[j];
                    flight_route += ' -> ' + arrival.airport;
                }

                flight_times += 'Leaves on ' + flight.depart_date + ' at ' + flight.depart_time;

                // Predefined payload with the generic template
                var payload = {
                    "client": "facebook-messenger",
                    "type": "generic-template",
                    "message": {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": flight_route,
                                        "subtitle": flight_times,
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "This is my flight",
                                                "payload": JSON.stringify(flight)
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                };

                // Send this to the user
                fbMessenger.sendCustomPayload(uid, payload);

                // Wait to prevent out-of-order messages (kinda)
                sleep(100);
            }

            // Send explanation text and a quick reply
            var quick_reply = {
                "client": "facebook-messenger",
                "type": "quick-reply",
                "message": {
                    "text": "Select your flight above. If none of them seem familiar, let me know.",
                    "quick_replies": [
                        {
                            "content_type": "text",
                            "title": "None of them are my flight",
                            "payload": "#IGNORE"
                        }
                    ]
                }
            };
            fbMessenger.sendCustomPayload(uid, quick_reply);

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
    setReminder: function (uid, result, flight) {

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