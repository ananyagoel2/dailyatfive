var FacebookStrategy = require('passport-facebook').Strategy;
// var TwitterStrategy = require('passport-twitter').Strategy;
// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User_m = require('../models/model_user');
var config_auth = require('./login_auth');
var bearer_strategy = require('passport-http-bearer').Strategy

module.exports = function(passport) {


    passport.use(new FacebookStrategy({
            clientID: config_auth.facebook_auth.client_ID,
            clientSecret: config_auth.facebook_auth.client_secret,
            callbackURL: config_auth.facebook_auth.callback_URL,
            profileFields: config_auth.facebook_auth.profileFields,
        },
        function(token, refreshToken, profile, done) {
            process.nextTick(function() {
                User_m.findOne({ 'facebook.facebook_id': profile.id }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    } else {
                        console.log(profile)
                        var newUser = new User_m();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
                        newUser.facebook_id = profile.id;
                        newUser.first_name= profile.name.givenName;
                        newUser.last_name = profile.name.familyName;
                        newUser.facebook.gender = profile.gender;

                        newUser.save(function(err) {
                            if (err)
                            {
                                throw err;

                            }
                            else{
                                return done(null, newUser);
                            }
                        });
                    }
                });
            });
        }));
    passport.use(
        new bearer_strategy(
            function(token, done) {
                User_m.findOne({ 'facebook.token': token },
                    function(err, user) {
                        if(err) {
                            return done(err)
                        }
                        if(!user) {
                            return done(null, false)
                        }

                        return done(null, user, { scope: 'all' })
                    }
                );
            }
        )
    );
    // passport.use(new TwitterStrategy({
    //         consumerKey: configAuth.twitterAuth.consumerKey,
    //         consumerSecret: configAuth.twitterAuth.consumerSecret,
    //         callbackURL: configAuth.twitterAuth.callbackURL,
    //     },
    //     function(token, tokenSecret, profile, done) {
    //         process.nextTick(function() {
    //             User_m.findOne({ 'twitter.id': profile.id }, function(err, user) {
    //                 if (err)
    //                     return done(err);
    //                 if (user) {
    //                     return done(null, user);
    //                 } else {
    //                     var newUser = new User_m();
    //                     console.log(profile)
    //                     newUser.twitter.id          = profile.id;
    //                     newUser.twitter.token       = token;
    //                     newUser.twitter.username    = profile.username;
    //                     newUser.twitter.displayName = profile.displayName;
    //                     newUser.save(function(err) {
    //                         if (err)
    //                             throw err;
    //                         return done(null, newUser);
    //                     });
    //                 }
    //             });
    //         });
    //     }));
    //
    // passport.use(new GoogleStrategy({
    //         clientID: configAuth.googleAuth.clientID,
    //         clientSecret: configAuth.googleAuth.clientSecret,
    //         callbackURL: configAuth.googleAuth.callbackURL,
    //     },
    //     function(token, refreshToken, profile, done) {
    //         process.nextTick(function() {
    //             User_m.findOne({ 'google.id': profile.id }, function(err, user) {
    //                 if (err)
    //                     return done(err);
    //                 if (user) {
    //                     return done(null, user);
    //                 } else {
    //                     var newUser = new User_m();
    //                     console.log(profile)
    //                     newUser.google.id = profile.id;
    //                     newUser.google.token = token;
    //                     newUser.google.name = profile.displayName;
    //                     newUser.google.email = profile.emails[0].value;
    //                     newUser.save(function(err) {
    //                         if (err)
    //                             throw err;
    //                         return done(null, newUser);
    //                     });
    //                 }
    //             });
    //         });
    //     }));

};
