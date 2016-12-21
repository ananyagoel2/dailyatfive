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



module.exports = router;
