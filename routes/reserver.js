var express = require('express');
var router = express.Router();
var washer = require('../models/washer');

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = function(passport) {

    // router.get('/', isAuthenticated, function(req, res) {
    //     res.render('washer', {
    //         message: req.flash('message')
    //     });
    // });

    router.post('/', isAuthenticated, function(req, res) {
        console.log(req.body);
        res.redirect('/home');
    });

    return router;
}