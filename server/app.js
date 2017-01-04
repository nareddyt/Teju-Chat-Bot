'use strict';

// This file sets up the express app with some common security features and error handling middleware

// NPM dependencies
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');

// My js dependencies
var logger = require('./../util/logger');
var errorHandler = require('./../util/errorHandler');
var router = require('./router');

// Create the app and set up other functionality
var app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// DEBUG: Log every request to the web server
app.use(function (req, res, next) {
    logger.log('info', req.originalUrl + ' with payload ' + JSON.stringify(req.body) + ' and headers ' + JSON.stringify(req.headers));
    next();
});

// Have the router handle all the predefined routes
app.use('/', router);

// Catch 404 and forward to error handler for undefined routes
app.use(function urlNotFound(req, res, next) {
    var err = new Error('Specified url was not found');
    err.status = 404;
    errorHandler.sendErrorResponse(err, req, res);
});

// "Catch" any errors
app.use(function (err, req, res, next) {
    var clientErr;

    if (err instanceof SyntaxError) {
        // Most likely an error with the payload format
        logger.log('warn', err);

        // Forward to the error handler
        clientErr = new Error('JSON format incorrect');
        clientErr.status = 400;
        errorHandler.sendErrorResponse(clientErr, req, res);
    }

    // FIXME we don't know what the error is yet
    throw err;
});

module.exports = app;