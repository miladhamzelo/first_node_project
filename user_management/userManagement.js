var User = require('../models/user');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var express = require('express');
var app = express();
var config = require('../jwt/config'); // get our config file
var morgan = require('morgan');
app.set('superSecret', config.secret); // secret variable
app.use(morgan('dev'));
module.exports = {

    signin: function (req, res) {

        // find the user
        console.log(req.body.name)
        User.findOne({
            name: req.body.name
        }, function (err, user) {

            if (err) throw err;

            if (!user) {
                res.json({success: false, message: 'Authentication failed. User not found.'});
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({success: false, message: 'Authentication failed. Wrong password.'});
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, app.get('superSecret'), {
                        // expiresInMinutes: 1440 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }

            }

        });
    },
    signup: function (req, res) {

        console.log(req.body);
        // create a sample user
        var user = new User(req.body);

        // save the sample user
        user.save(function (err) {
            if (err) throw err;

            var token = jwt.sign(user, app.get('superSecret'), {
                // expiresInMinutes: 1440 // expires in 24 hours
            });

            // return the information including token as JSON
            res.json({
                success: true,
                message: 'signUp was successful!',
                token: token
            });
        });
    },

    checkUserNameIsAvailable: function (req, res, next) {
        console.log(req.body);
        User.find({name: req.body.name}, function (err, users) {

            if (err) return console.error(err);
            console.log(users);
            if (users.length == 0) {
                next();
            } else {
                res.json({success: false, message: 'userName is not available'});
            }
        });

    },
    verfiyToken: function  (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

// decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    req.user = decoded._doc;
                    req.user.password = null;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    },
};