/**
 * Created by ananyagoel on 06/01/17.
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');


var user_m = require('../models/model_user');
var config = require('../config/config');

router.route('/')
    .post(function (req, res) {
        user_m.findOne({email:req.body.email},function (err, user) {
            if(err){
                res.status('400').send(err);
            }
            else{
                if(!user)
                {
                    res.status(400).send({message:"Register!"})
                }
                else{
                    if(user.password){
                        user.compare_password(req.body.password,function (err,is_match) {
                            if(err)
                            {
                                res.status(400).send({error:err})
                            }
                            else if (is_match)
                            {
                                res.redirect("/register/auth/response?user_id="+user._id+"&safeword="+config.safeword);
                            }
                            else
                            {
                                res.status(400).send({message:"Wrong credentials"})
                            }
                        })
                    }
                    else{
                        res.redirect()
                    }
                }
            }
        })
    });

module.exports = router;
