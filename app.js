'use strict';

// NPM dependencies
var express = require('express');
var bodyParser = require('body-parser');

// My js files
var logger = require('./util/logger');
var errorHandler = require('./util/errorHandler');
var router = require('./router');

// Create the app
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Log all requests to the web server
app.use(function (req, res, next) {
    logger.log('info', req.originalUrl + ' with payload ' + JSON.stringify(req.body));
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

module.exports = app;