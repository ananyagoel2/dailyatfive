/**
 * Created by ananyagoel on 12/12/16.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var graph = require('fbgraph');
var Promise = require('bluebird');


var user = require('../models/model_user');
var jwt= require('../utilities/jwt_utility');
var facebook_data = require('../models/model_facebook');
var config = require('../config/config');
var login_auth = require('../config/login_auth');


/* functions  */

var facebook_extending_token = function (user_f) {
    graph.extendAccessToken({
        "client_id":login_auth.facebook_auth.client_ID,
        "client_secret":login_auth.facebook_auth.client_secret,
        "access_token":user_f.facebook.token
    },function (err, facebook_response) {
        if(facebook_response.access_token){
            user.findByIdAndUpdate(user_f._id,{'facebook.long_access_token':facebook_response.access_token},function (err,user_face) {
                if(err){
                    console.log(err)
                }
                // else{
                //     console.log(user_face)
                // }
            })
        }

    })
}




/* GET users listing. */

router.post('/', function(req, res, next) {
    // check whether user with that facebook_id exists or not
    user.findOne({facebook_id:req.body.facebook_id},function (err, user_f) {
        if(err){
            res.status('400').send(err);
        }
        else
        {
            if(user_f){
                if(user_f.facebook.token==req.body.access_token){
                    facebook_extending_token(user_f);
                    res.redirect("/register/auth/response?user_id="+user_f._id+"&safeword="+config.safeword);
                    // res.redirect("/register/auth/facebook/token?access_token="+req.body.access_token);
                }
                else{
                    user_f.facebook.token=req.body.access_token;
                    user_f.save(function (err) {
                        if(err){
                            res.status('400').send(err);
                        }
                        else
                        {
                            var new_facebook = {
                                user:user_f._id,
                                user_friends: req.body.user_friends,
                                user_likes: req.body.user_likes,
                                work: req.body.work,
                                facebook_id: req.body.facebook_id,
                                education : req.body.education
                            };

                            facebook_data.findByIdAndUpdate(user_f.facebook.facebook_data,new_facebook,function (err,user_face) {
                                if(err){
                                    console.log(err);
                                    res.redirect("/register/auth/response?user_id="+user_f._id+"&safeword="+config.safeword);
                                    facebook_extending_token(user_f);
                                }
                                else {
                                    res.redirect("/register/auth/response?user_id="+user_f._id+"&safeword="+config.safeword);
                                    facebook_extending_token(user_f);
                                    // res.redirect("/register/auth/facebook/token?access_token="+req.body.access_token);
                                }

                            })


                        }
                    })
                }
            }
            else{
                var new_user = user({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email:req.body.email,
                    mobile_number:req.body.mobile_number,
                    extension:req.body.extension,
                    admin: req.body.admin,
                    facebook_id:req.body.facebook_id,
                    fcm_token: req.body.fcm_token,
                    gender: req.body.gender,
                    description: req.body.description,
                    birthday: req.body.birthday,
                    'facebook.id': req.body.facebook_id,
                    'facebook.token': req.body.access_token
                });

                new_user.save(function(err) {
                    if (err){
                        res.status('400').send(err);
                    }
                    else {
                        var new_facebook = facebook_data({
                            user:new_user._id,
                            user_friends: req.body.user_friends,
                            user_likes: req.body.user_likes,
                            work: req.body.work,
                            facebook_id: req.body.facebook_id,
                            education : req.body.education
                        });
                        new_facebook.save(function (err) {
                            if (err){
                                res.status('400').send(err)
                            }
                            else
                            {
                                user.findById(new_user._id,function (err, user_o) {
                                    if(err){
                                        res.status('400').send(err)
                                    }
                                    else{
                                        user_o.facebook.facebook_data =new_facebook._id;
                                        user_o.save(function (err) {
                                            if(err){
                                                res.status('400').send(err);
                                            }
                                            else{
                                                facebook_extending_token(user_f);
                                                res.redirect("/register/auth/response?user_id="+user_o._id+"&safeword="+config.safeword);
                                                // res.redirect("/register/auth/facebook/token?access_token="+req.body.access_token);
                                            }
                                        })
                                    }
                                })

                            }
                        })
                    }
                });
            }
        }
    })
});


router.get('/auth/facebook', passport.authenticate('facebook',{scope:['email','phone_number']}));


router.get('/auth/facebook/token',
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        var response = {}
        return Promise.props({
        user:req.user.toJSON(),
        access_token:jwt.createToken(jwt.generatePayload(user))
        }).then(function (response) {
            res.status(200).send(response);
        })

    }
);


router.get('/auth/response/',function (req,res) {
    if(req.query.safeword==config.safeword){
        user.findOne({_id:req.query.user_id},function (err,user_res) {
            var response = {}
            return Promise.props({
                user:user_res.toJSON(),
                access_token:jwt.createToken(jwt.generatePayload(user_res)),
                min_version_code:config.min_version_code,
                current_version_code:config.current_version_code
            }).then(function (response) {
                res.status(200).send(response);
            })
        })
    }
    else
    {
        res.status(401).send({error:"unauthorized"});
    }
})


router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: "/" }),
    function(req, res) {
        res.redirect("/register/auth/facebook/token?access_token=" + req.user.facebook.token);
    }
);



module.exports = router;
