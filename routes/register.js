/**
 * Created by ananyagoel on 12/12/16.
 */
var express = require('express');
var router = express.Router();
var user = require('../models/model_user');
var passport = require('passport');
var jwt= require('../utilities/jwt_utility');

/* GET users listing. */
router.post('/', function(req, res, next) {
    // res.send('respond with a resource');
    var newUser = user({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email:req.body.email,
        mobile_number:req.body.mobile_number,
        extension:req.body.extension,
        admin: req.body.admin,
        'facebook.id': req.body.facebook_id,
        facebook_id:req.body.facebook_id,
        'facebook.token' : req.body.token,
        'facebook.gender': req.body.gender,
        'facebook.email' : req.body.email,
        'facebook.display_name': req.body.first_name+' '+req.body.last_name,
        'facebook.user_likes': req.body.user_likes,
        'facebook.user_friends_count': req.body.user_friends_count
    });

    newUser.save(function(err) {
        if (err){
            res.status('400').send(err);
        }
        else {
            console.log(newUser._id)
            res.redirect("/users/"+newUser._id);
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
