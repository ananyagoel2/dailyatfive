/**
 * Created by ananyagoel on 16/12/16.
 */

// config/passport.js

// load all the things we need
// var LocalStrategy    = require('passport-local').Strategy;
var facebook_strategy = require('passport-facebook').Strategy;
var facebook_token_strategy = require('passport-facebook-token');
// load up the user model
var user  = require('../models/model_user');

// load the auth variables
var config_auth = require('./login_auth');

module.exports = function(passport) {

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new facebook_strategy({

            // pull in our app id and secret from our auth.js file
            clientID        : config_auth.facebook_auth.client_ID,
            clientSecret    : config_auth.facebook_auth.client_secret,
            callbackURL     : config_auth.facebook_auth.callback_URL,
        },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {
                console.log("here")
                // find the user in the database based on their facebook id
                user.findOne({ 'facebook.id' : profile.id }, function(err, User) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, User); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them

                        var new_user = new user();

                        // set all of the facebook information in our user model
                        new_user.facebook.id    = profile.id; // set the users facebook id
                        new_user.facebook.token = token; // we will save the token that facebook provides to the user
                        new_user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        new_user.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        new_user.email = profile.emails[0].value;
                        new_user.first_name = profile.name.givenName;
                        new_user.last_name = profile.name.familyName;
                        // save our user to the database
                        console.log("new user /n"+new_user)
                        new_user.save(function(err) {
                            if (err){
                                console.log(err)
                                throw err;
                            }

                            else{
                                return done(null, new_user);
                            }
                            // if successful, return the new user
                        });
                    }

                });
            });

        }));

};