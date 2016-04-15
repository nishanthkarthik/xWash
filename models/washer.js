"use strict";

var mongoose = require('mongoose');

module.exports = mongoose.model('Washer', {
    name: String,
    location: String,
    reserver: [{
        username: String,
        key: String,
        starttime: Date,
        endtime: Date
    }]
});