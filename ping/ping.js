'use strict';

// File that contains the ping handler

function handlePing(req, res) {
    res.status(200).send('pong');
}

module.exports = handlePing;