var express = require('express');
var router = express.Router();
var washer = require('../models/washer');
var moment = require('moment');

var isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function(passport) {

	/* GET login page. */
	router.get('/', function(req, res) {
		// Display the Login page with any flash message, if any
		res.render('index', {
			message: req.flash('message')
		});
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash: true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res) {
		res.render('register', {
			message: req.flash('message')
		});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res) {
		washer.find({}, function(err, washers) {
			if (err) {
				console.log(err);
				throw err;
			}

			var reservationList = [];

			for (i = 0; i < washers.length; ++i) {
				for (j = 0; j < washers[i].reserver.length; ++j) {
					if (washers[i].reserver[j].username == req.user.username)
						reservationList.push({
							machineName: washers[i].location,
							date: moment(washers[i].reserver[j].starttime).utc().local().format('Do MMM Y'),
							fromTime: moment(washers[i].reserver[j].starttime).utc().local().format('hh:mm a'),
							toTime: moment(washers[i].reserver[j].endtime).utc().local().format('hh:mm a'),
							reservationKey : washers[i].reserver[j].key
						});
				}
			}

			console.log('reservers');
			console.log(reservationList);

			res.render('home', {
				reservers: reservationList,
				user: req.user,
				washers: washers,
				message: req.flash('message')
			});
		});


	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}