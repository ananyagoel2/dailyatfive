var express = require('express');
var router = express.Router();
var user_m= require('../models/model_user');
var _= require('lodash');
var config = require('../config/config');
var msg91 = require('msg91')(config.msg91_auth_key, config.msg91_sender_id, config.msg91_route_no );

/* GET users listing. */
router.get('/', function(req, res, next) {
    user_m.find(function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
});

router.route('/:user_id')
    .get(function (req, res) {
    user_m.findById(req.params.user_id,function (err, user) {
        if (err){
            res.status(400).send({error:err})
        }
        else if(user)
        {
            res.status(200).send(user)
        }
        else
        {
            res.status(404).send({message:"User not found!"})
        }
    })
})

    .put(function (req, res) {
        var accepted_input_keys = ['email', 'mobile_number', 'first_name', 'last_name', 'extension','facebook.token','profile_created'];

        // for (var key in req.body ) {
        //     if (req.body.hasOwnProperty(key) && _.includes(accepted_input_keys, key)) {
        //         user_update_object[key] = req.body[key];
        //     }
        // }
        var user_update_object={
            email:req.body.email,
            mobile_number:req.body.mobile_number,
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            extension:req.body.extension,
            'facebook.token':req.body.token,
            gender:req.body.gender,
            birthday:req.body.birthday,
            is_new_user:req.body.is_new_user,
            admin:req.body.admin,
            profile_created:req.body.profile_created
        }
        var result_updated_object = _.omitBy(user_update_object, _.isNil);
        user_m.findByIdAndUpdate(req.params.user_id,result_updated_object,function (err,user_res) {
        if(err){
                console.log(err)
                res.status(400).send(err)
            }
            else if(user_res)
            {
                // console.log(user_res)
                //USED 303 to redirect to get of the route! it works fine af
                // res.redirect(303,"/users/"+user_m._id);
                user_m.findById(user_res._id,function (err, user) {
                    if (err){
                        res.status(400).send({error:err})
                    }
                    else
                    {
                        res.status(200).send(user)
                    }
                })
                // res.send(user_res)
            }
            else
            {
                res.status(404).send({message:"User not found!"})
            }

    })
    });


router.route('/:user_id/mobile_verification')
    .post(function (req, res) {
        var mobile_number= req.body.mobile_number;
        if(mobile_number){
            var OTP ='' + (Math.floor(Math.random() * (9998 - 1001)) + 1001);
            user_m.findByIdAndUpdate(req.params.user_id,{mobile_number:mobile_number,auth_number:OTP},function (err,user_res) {
                if(err){
                    console.log(err)
                    res.status(400).send(err)
                }
                else if(user_res)
                {
                    var message = "Hi "+user_res.first_name+"!\nYour one time password is "+OTP+".";
                    msg91.send(mobile_number,message,function (err,response) {
                        if(err){
                            res.status(400).send({error:err})
                        }
                        else{
                            user_m.findById(user_res._id,function (err, user) {
                                if (err){
                                    res.status(400).send({error:err})
                                }
                                else
                                {
                                    res.status(200).send(user)
                                }
                            })

                        }
                    })
                    // res.send(user_res)
                }
                else{
                    res.status(404).send({message:"User not found!"})
                }
            })
        }
        else{
            res.status(400).send({error:"enter mobile number"})
        }

    });

router.route('/:user_id/verify_OTP/:OTP')
    .post(function (req, res) {
        console.log("inside verify")
        user_m.findById(req.params.user_id,function (err, user) {
            if(err){
                console.log(err)
                res.staus(400).send(err)
            }
            else if (user)
            {
                if(req.params.OTP==user.auth_number)
                {
                    user.mobile_verified=true;
                    console.log("here")
                    user.save(function (err) {
                        if(err){
                            res.status(400).send(err);
                        }
                        else
                        {
                            user_m.findById(user_res._id,function (err, user) {
                                if (err){
                                    res.status(400).send({error:err})
                                }
                                else
                                {
                                    res.status(200).send(user)
                                }
                            })
                        }
                    })
                }
                else{
                    console.log("inside auth failure")
                    res.status(1100).send("OTP mismatch. Retry")
                }
            }
            else
            {
                res.status(404).send({message:"User not found!"})
            }
        })

    });

router.route('/:user_id/facebook')
    .get(function (req, res) {
        user_m.findById(req.params.user_id)
            .populate('facebook.facebook_data')
            .exec(function (err, user) {
                if(err){
                    res.status(400).send(err)
                }
                else
                {
                    res.status(200).send(user)
                }
            })
    })

module.exports = router;
