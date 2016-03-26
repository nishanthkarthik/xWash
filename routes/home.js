var express = require('express');
var router = express.router;

/* GET home page. */
router.get('/', function(req, res) {
	// Display the Login page with any flash message, if any
	res.render('home', {
		message: req.flash('logged in > ')
	});
});
