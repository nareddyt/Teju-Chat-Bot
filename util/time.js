'use strict';

var moment = require('moment');

module.exports = {
    getCurrTimeInt: function () {
        return moment().format('YYYYMMDDHHmmss');
    }
};