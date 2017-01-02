'use strict';

// File that contains functions needed to upkeep security of the service

// Npm dependency
var crypto = require('crypto');

module.exports = {

    /**
     * Calculates the sha1 hash of the text, using the db app secret as the key
     */
    getSHA1WithAppSecret: function (text) {
        // Set up
        var key = process.env.FB_APP_SECRET;
        var algorithm = 'sha1';
        var hmac = crypto.createHmac(algorithm, key);
        hmac.setEncoding('hex');

        // Write in the text that you want the hmac digest for
        hmac.write(text);

        // You can't read from the stream until you call end()
        hmac.end();

        // Read out hash
        return hmac.read();
    },

    /**
     * Convert non-ascii characters to lowercase escaped unicode representation.
     * Note: All forward-slashes are escaped with a backslash
     */
    toUnicode: function (theString) {
        var unicodeString = '';
        for (var i = 0; i < theString.length; i++) {

            if (theString.charAt(i) == '/') {
                unicodeString += '\\/';
            } else if (theString.charCodeAt(i) <= 127) {
                unicodeString += theString.charAt(i);
            } else {
                var theUnicode = theString.charCodeAt(i).toString(16).toLowerCase();
                while (theUnicode.length < 4) {
                    theUnicode = '0' + theUnicode;
                }
                theUnicode = '\\u' + theUnicode;
                unicodeString += theUnicode;
            }
        }
        return unicodeString;
    }

};



