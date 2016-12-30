// NPM dependencies
var express = require('express');
var bodyParser = require('body-parser');

// My js files
var log = require('./logger');
var router = require('./router');

// Create the app
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Have the router handle all the predefined routes
app.use('/', router);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    errorHandler(err, req, res);
});

// Error handler
function errorHandler(err, req, res) {
    var message = err.status + ': ' + err.message;
    log('warn', message);
    res.status(err.status || 500).send(message);
}

module.exports = app;