'use strict';

// NPM dependencies
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');

// My js files
var logger = require('./util/logger');
var errorHandler = require('./util/errorHandler');
var router = require('./router');

// Create the app
var app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Log all requests to the web server
app.use(function (req, res, next) {
    logger.log('info', req.originalUrl + ' with payload ' + JSON.stringify(req.body) + ' and headers ' + JSON.stringify(req.headers));
    next();
});

// Have the router handle all the predefined routes
app.use('/', router);

// Catch 404 and forward to error handler
app.use(function urlNotFound(req, res, next) {
    var err = new Error('Specified url was not found');
    err.status = 404;
    errorHandler.handleError(err, req, res);
});

// "Catch" any errors
app.use(function (err, req, res, next) {
    var clientErr;

    if (err instanceof SyntaxError) {
        logger.log('warn', err);
        clientErr = new Error('JSON format incorrect');
        clientErr.status = 400;
        errorHandler.handleError(clientErr, req, res);
    } else {
        logger.log('error', err);
        clientErr = new Error('Internal Server Error :(');
        clientErr.status = 500;
        errorHandler.handleError(clientErr, req, res);
    }
});

module.exports = app;