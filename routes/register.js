/**
 * Created by ananyagoel on 12/12/16.
 */
var express = require('express');
var router = express.Router();
var user = require('../models/model_user');
// var local_strategy    = require('passport-local').Strategy;
var facebook_strategy = require('passport-facebook').Strategy;
var config_auth = require('../config/login_auth');
var FacebookTokenStrategy = require('passport-facebook-token');
var passport = require('passport');


/* GET users listing. */
router.post('/', function(req, res, next) {
    // res.send('respond with a resource');
    var newUser = user({
        first_name: 'Ananya',
        last_name: 'Goel',
        email:'goelananya2@gmail.com',
        mobile_number:"9999953547",
        extension:"+91",
        password: 'password',
        admin: true
    });

// save the user
    newUser.save(function(err) {
        if (err){
            res.status('400').send(err);
        }
        else {
            res.send('User created!');
        }
    });

});

router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['user_friends','email'] }));
router.get('/auth/facebook/token', passport.authenticate('facebook-token',{session:false}),function (req, res) {
    console.log("here2")
    res.send(req.user? 200 : 401)
});

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/register/profile',
    failureRedirect: '/',
}));
router.get('/profile', function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
