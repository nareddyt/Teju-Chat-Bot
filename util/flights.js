'use strict';

// File that contains flight processing functions

// My js dependencies
var logger = require('./logger');

module.exports = {

    /**
     * Finds the best matches for an airport code in a string
     */
    findAirportCode: function (text) {
        if (text.length < 3) {
            return '';
        }

        var matches = [];
        for (var i = 0; i < text.length - 5; i++) {
            var current = text.substring(i, i + 5);

            if (current.search('\\s([a-z]|[A-Z])\\w\\w\\s') === 0) {
                matches.push(current.substring(1, 4));
            }
        }

        return matches;
    }

};



