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
function valiDate(data, rUser, done) {
    if (!(('washer' in data) && ('date' in data) && ('from' in data) && ('to' in data))) {
        done('One or more inputs missing');
        return;
    }

    var t_now = moment();
    var t_from = moment(data.date + ' ' + data.from);
    var t_to = moment(data.date + ' ' + data.to);

    if (!(t_from.isAfter(t_now) && t_to.isAfter(t_now) && t_to.isAfter(t_from))) {
        done('Reservation timings must be for the future / To time must be after From time');
        return;
    }

    if (washer.findOne({
            location: data.washer
        }, function(err, machine) {
            if (err) {
                console.log(err);
                done('internal error');
                return;
            } else if (!machine) {
                done('Washing machine not found');
                return;
            }

            for (i = 0; i < machine.reserver.length; ++i) {
                // Check for overlap between two time intervals 
                // t_from -> t_to
                // machine.reserver[i].starttime -> ..endtime
                // [a0,a1] with [b0,b1]
                // by a0 <= b1 && b0 <= a1
                // where a = [t_from,t_to]

                var slot_from = moment(machine.reserver[i].starttime);
                var slot_to = moment(machine.reserver[i].endtime);

                if (t_from.unix() < slot_to.unix() && slot_from.unix() < t_to.unix()) {
                    console.log('interference in time slot found');
                    done('The slots interfere with previous reservations');
                    return;
                }
            }

            console.log('slot interference not found');

            var randomKey = Math.floor(Math.random() * 900000) + 100000;
            machine.reserver.push({
                username: rUser.username,
                key: randomKey,
                starttime: t_from,
                endtime: t_to
            });
            machine.save(function(err) {
                if (err) {
                    console.log(err);
                    done('internal update error');
                }
                done(null, randomKey);
            });

        }));
}

module.exports = function(passport) {

    // router.get('/', isAuthenticated, function(req, res) {
    //     res.render('washer', {
    //         message: req.flash('message')
    //     });
    // });

    router.post('/', isAuthenticated, function(req, res) {
        //console.log(req.body);
        valiDate(req.body, req.user, function(err, key) {
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