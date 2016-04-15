"use strict";

var express = require('express');
var moment = require('moment');
var router = express.Router();
var washer = require('../models/washer');

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = function(passport) {

    router.get('/:machineName', isAuthenticated, function(req, res) {

        if (!req.params.machineName) {
            res.redirect('/');
            return;
        }

        washer.findOne({
            name: req.params.machineName
        }, function(err, machine) {
            if (err) {
                console.log(err);
                req.flash('message', 'Internal Error');
                res.redirect('/home');
                return;
            }
            if (!machine) {
                req.flash('message', 'Machine not found');
                res.redirect('/home');
            }

            var slotsReserved = [];
            for (var i = 0; i < machine.reserver.length; ++i) {
                slotsReserved.push({
                    userName: machine.reserver[i].username,
                    date: moment(machine.reserver[i].starttime).utc().local().format('Do MMM Y'),
                    fromTime: moment(machine.reserver[i].starttime).utc().local().format('hh:mm a'),
                    toTime: moment(machine.reserver[i].endtime).utc().local().format('hh:mm a'),
                    _sortKey: moment(machine.reserver[i].starttime).unix()
                });
            }

            slotsReserved.sort(function(a, b) {
                return a._sortKey - b._sortKey;
            });

            res.render('slots', {
                message: req.flash('message'),
                machineName: machine.location,
                slots: slotsReserved
            });

        });

        // res.render('washer', {
        //     message: req.flash('message'),
        // });
    });

    return router;
}