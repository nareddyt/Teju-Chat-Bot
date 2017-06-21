'use strict';

// File that contains the ping handler

function handlePing(req, res) {
    res.status(200).send('loaderio-fb617d85d8368ab570af9637375024ce');
}

module.exports = handlePing;
