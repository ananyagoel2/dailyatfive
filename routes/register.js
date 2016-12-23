/**
 * Created by ananyagoel on 12/12/16.
 */
var express = require('express');
var router = express.Router();
var user = require('../models/model_user');
var passport = require('passport');
var jwt= require('../utilities/jwt_utility');
var facebook_data = require('../models/model_facebook');
/* GET users listing. */
router.post('/', function(req, res, next) {
    // res.send('respond with a resource');
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
        'facebook.token': req.body.access_token,
    });

    new_user.save(function(err) {
        if (err){
            res.status('400').send(err);
        }
        else {
            console.log(new_user._id)
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
                                        res.redirect("/users/"+user_o._id);
                                    }
                                })
                        }
                    })

                }
            })
        }
    });

});

router.get('/auth/facebook', passport.authenticate('facebook',{scope:['email','phone_number']}));

router.get('/auth/facebook/token',
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        var response = {}
        response.user=req.user.toJSON();
        response.access_token = jwt.createToken(jwt.generatePayload(user))
        res.send(response);
    }
);


router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: "/" }),
    function(req, res) {
        res.redirect("/register/auth/facebook/token?access_token=" + req.user.facebook.token);
    }
);



module.exports = router;
