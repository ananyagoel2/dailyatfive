var express = require('express');
var router = express.Router();
var user_m= require('../models/model_user');
var _= require('lodash');

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
        else
        {
            res.status(200).send(user)
        }
    })
})

    .put(function (req, res) {
        var accepted_input_keys = ['email', 'mobile_number', 'first_name', 'last_name', 'extension','facebook.token'];

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
            admin:req.body.admin
        }
        var result_updated_object = _.omitBy(user_update_object, _.isNil);
        user_m.findByIdAndUpdate(req.params.user_id,result_updated_object,function (err,user_res) {
        if(err){
                console.log(err)
                res.status(400).send(err)
            }
            else
            {
                console.log(user_res)
                //USED 303 to redirect to get of the route! it works fine af
                // res.redirect(303,"/users/"+user._id);
                res.send(user_res)
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
