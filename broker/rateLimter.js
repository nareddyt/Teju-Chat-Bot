'use strict';

// File that contains functionalities of the rate limiter

// My js dependencies
var logger = require('../util/logger');
var time = require('../util/time');
var requestTimesDb = require('../db/postgre_sql/requestTimes');
var fbMessenger = require('../util/fbMessenger');
var nlp = require('./nlp');

module.exports = {
    /**
     * If enabled, then the rate limiter will be used.
     * This corresponds to the dbs being error-free.
     */
    enabled: false,

    /**
     * Uses the rate limiter only if it is enabled.
     */
    useRateLimiting: function (uid, message) {
        if (this.enabled) {
            // Use the rate limiter
            getUserRequests(uid, message);
        } else {
            // Continue on with the request
            logger.log('warn', 'not using rate limiting');
            nlp(uid, message);
        }
    }

};

/**
 * Get the last 5 timestamps the user has sent a message.
 */
function getUserRequests(uid, message) {
    // Async call to the database to get the info
    requestTimesDb.getUser(uid, getUserCallback);

    /**
     * Callback for when we get the info from the db
     */
    function getUserCallback(err, result) {
        if (err) {
            logger.log('error', err);
            this.enabled = false;
            nlp(uid, message);
        } else {
            // Forward to the next function
            checkUserExists(uid, message, result);
        }
    }

}

/**
 * Based on the results from the DB, checks if the user actually is in the DB.
 */
function checkUserExists(uid, message, result) {

    // Get the data we care about for the user
    var uidData = result.rows[0];

    if (uidData) {
        // User exists already! Move on to the rate limit calculation
        calculateRateLimit(uid, message, uidData)
    } else {
        // Async call to add the user to the DB
        logger.log('info', 'uid=' + uid + ' is new!');
        requestTimesDb.createUser(uid, createUserCallback);
    }

    /**
     * Callback for when the user is added to the DB
     */
    function createUserCallback(err, result) {
        if (err) {
            logger.log('error', err);
            this.enabled = false;
            nlp(uid, message);
        } else {
            // Go back and query the DB for the default values of the user we just added
            getUserRequests(uid, message);
        }
    }

}

/**
 * Calculates whether the user has to be rate limited and updates the dbs.
 */
function calculateRateLimit(uid, message, uidData) {
    // Max allowed time between max and min
    var limitTime = process.env.MAX_TIME_FOR_RATE_LIMIT;

    // Calculate the min and max request times over the 5 period interval
    var minTime = Math.min(uidData.time_1, uidData.time_2, uidData.time_3, uidData.time_4, uidData.time_5);
    var maxTime = Math.max(uidData.time_1, uidData.time_2, uidData.time_3, uidData.time_4, uidData.time_5);

    // Do the check
    if (maxTime - minTime < limitTime) {

        // Apply rate limiting!
        logger.log('warn', 'rate limiting being applied for uid=' + uid);
        fbMessenger.sendTextMessage(uid, "Because you're spamming, I will not answer you anymore. Sorry :(");
        // TODO. Basic denial of service currently

    } else {

        // Set the correct time in the db
        var indexToUpdate;
        if (minTime == uidData.time_1) {
            indexToUpdate = 1;
        } else if (minTime == uidData.time_2) {
            indexToUpdate = 2;
        } else if (minTime == uidData.time_3) {
            indexToUpdate = 3;
        } else if (minTime == uidData.time_4) {
            indexToUpdate = 4;
        } else {
            indexToUpdate = 5;
        }

        requestTimesDb.updateTime(uid, indexToUpdate, time.getCurrTimeInt(), updateTimeCallback);
    }

    /**
     * Callback for when the user's request time is updated
     */
    function updateTimeCallback(err, result) {
        if (err) {
            logger.log('error', err);
            this.enabled = false;
            nlp(uid, message);
        } else {
            // Continue on with the request
            nlp(uid, message);
        }
    }

}
