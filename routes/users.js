var express = require('express');
var router = express.Router();
var user_m= require('../models/model_user');


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
        var accepted_input_keys = ['email', 'mobile_number', 'first_name', 'last_name', 'extension','facebook.email','facebook.token'];
        var user_update_object = {};

        for (var key in req.body ) {
            if (req.body.hasOwnProperty(key) && _.includes(accepted_input_keys, key)) {
                user_update_object[key] = req.body[key];
            }
        }
        console.log(user_update_object)
        user_m.findByIdandUpdate(req.params.user_id,user_update_object,function (err,user) {
        if(err){
                res.status(400).send(err)
            }
            else
            {
                //USED 303 to redirect to get of the route! it works fine af
                res.redirect(303,"/users/"+user._id);
            }
    })
    });


module.exports = router;
