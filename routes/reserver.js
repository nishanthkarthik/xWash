var express = require('express');
var router = express.Router();
var washer = require('../models/washer');
var moment = require('moment');

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

//validate + Date = valiDate
function valiDate(data, done) {
    if (!(('washer' in data) && ('date' in data) && ('from' in data) && ('to' in data))) {
        done('One or more inputs missing');
        return;
    } else {
        done(null, 'samplekey');
    }
}

module.exports = function(passport) {

    // router.get('/', isAuthenticated, function(req, res) {
    //     res.render('washer', {
    //         message: req.flash('message')
    //     });
    // });

    router.post('/', isAuthenticated, function(req, res) {
        console.log(req.body);
        valiDate(req.body, function(err, key) {
            if (err) {
                console.log(err);
                req.flash('message', err)
                res.redirect('/home');
            } else {
                req.flash('message', 'Key for Reservation - ' + key);
                res.redirect('/home');
            }
        });
    });

    return router;
}