"use strict";

var express = require('express');
var moment = require('moment');
var router = express.Router();
var washer = require('../models/washer');

var isAuthenticated = function(req, res, next) {
    // if (req.isAuthenticated())
    //     return next();
    // res.redirect('/');

    // Allow unauthenticated client machines to check their status
    return next();
}

module.exports = function(passport) {

    router.get('/', isAuthenticated, function(req, res) {
        res.end('specify machine paramater');
    });

    router.get('/:machineName', function(req, res) {
        console.log(req.params.machineName + ' machine requested key');
        washer.findOne({
            name: req.params.machineName
        }, function(err, machine) {

            if (!machine) {
                res.end('machine not found');
                return;
            }

            //console.log(machine);
            
            var t_now = moment();
            for (var i = 0; i < machine.reserver.length; ++i) {
                var slot_start = moment(machine.reserver[i].starttime);
                var slot_end = moment(machine.reserver[i].endtime);
                if (t_now.isSameOrAfter(slot_start) && t_now.isSameOrBefore(slot_end)) {
                    res.end(machine.reserver[i].key);
                    return;
                }
            }

            res.end('-1');

        });
    });

    return router;
}
