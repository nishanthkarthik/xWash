var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {

            findOrCreateUser = function() {
                User.findOne({
                    'username': username
                }, function(err, user) {
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    if (user) {
                        console.log('User already exists with username: ' + username);
                        return done(null, false, req.flash('message', 'User Already Exists'));
                    } else {
                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.rollno = req.param('rollno');

                        newUser.save(function(err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));

    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}