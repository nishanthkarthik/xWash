"use strict";

var express = require('express');
var router = express.Router();
var washer = require('../models/washer');

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = function(passport) {

    router.get('/', isAuthenticated, function(req, res) {
        res.render('washer', {
            message: req.flash('message')
        });
    });

    router.post('/', isAuthenticated, function(req, res) {
        if (req.user.admin) {
            washer.findOne({
                'name': req.body.name
            }, function(err, user) {

                if (err) {
                    console.log('Error in adding machine: ' + err);
                }

                if (user) {
                    console.log('Machine already exists with username: ' + req.body.name);
                    req.flash('message', 'Machine name used already')
                    res.redirect('/home');
                } else {
                    var newMachine = new washer();
                    newMachine.name = req.body.name;
                    newMachine.location = req.body.location;

                    newMachine.save(function(err) {
                        if (err) {
                            console.log('Error in Saving machine: ' + err);
                            throw err;
                        }
                        console.log('Machine added');
                        req.flash('message', 'Machine added')
                        res.redirect('/home');
                    });
                }

            });

        } else {
            console.log('access denied to add washer');

            req.flash('message', 'access denied');
            res.redirect('/home');

            //res.render('washer', {
            //    message: req.flash('Access denied')
            //});
        }
    });


    return router;
}