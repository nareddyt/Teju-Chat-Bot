'use strict';

var crypto = require('crypto');

module.exports = {

    getSHA1WithAppSecret: function (body) {
        // Set up for sha1 hashing using the fb app secret as the key
        var key = process.env.FB_APP_SECRET;
        var algorithm = 'sha1';
        var hmac = crypto.createHmac(algorithm, key);
        hmac.setEncoding('hex');

        // write in the text that you want the hmac digest for
        hmac.write(body);

        // you can't read from the stream until you call end()
        hmac.end();

        // read out hash
        return hmac.read();
    }

};

