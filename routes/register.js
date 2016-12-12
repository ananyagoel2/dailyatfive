/**
 * Created by ananyagoel on 12/12/16.
 */
var express = require('express');
var router = express.Router();
var user = require('../models/model_user');

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

module.exports = router;
