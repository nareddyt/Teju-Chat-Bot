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
            return [];
        } else if (text.length === 3) {
            if (text.search('([a-z]|[A-Z])\\w\\w') !== -1) {
                return [text];
            }
            return [];
        } else if (text.length === 4) {
            if (text.search('([a-z]|[A-Z])\\w\\w\\W') !== -1) {
                return [text.substring(0, 3)];
            }
            return [];
        }

        var matches = [];
        var end = text.substring(text.length - 4, text.length);
        if (end.search('\\s([a-z]|[A-Z])\\w\\w') === 0) {
            matches.push(end.substring(1));
        }

        for (var i = 0; i < text.length - 5; i++) {
            var current = text.substring(i, i + 5);

            if (current.search('\\s([a-z]|[A-Z])\\w\\w\\s') === 0) {
                matches.push(current.substring(1, 4));
            }
        }

        return matches;
    }

};



