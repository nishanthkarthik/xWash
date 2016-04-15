"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var credentials = require('./env.config.js');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);
var routes = require('./routes/index')(passport);
var washer = require('./routes/washer')(passport);
var reserver = require('./routes/reserver')(passport);
var manager = require('./routes/manager')(passport);
var slots = require('./routes/slots')(passport);

var app = express();
mongoose.connect(credentials.mongo.url);

//configure passport
app.use(expressSession({
  secret: credentials.expressSecret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 } ));

app.use('/', routes);
app.use('/washer', washer);
app.use('/reserve', reserver);
app.use('/manager', manager);
app.use('/slots', slots);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;