var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/register/profile',
    failureRedirect: '/',
}));

module.exports = router;
