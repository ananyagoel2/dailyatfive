var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');
var passport = require('passport');
var session = require('express-session');
var jwt = require('express-jwt');
var _ = require('lodash');

var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');


var app = express();
require('./config/passport')(passport);


//JWT setup
app.use(function (req, res, next) {
    var auth_token = req.headers.authorization;
    req.headers.authorization = _.replace(auth_token, 'JWT', 'Bearer');
    next();
});

app.use(jwt({ secret: config.JWT_secret_key}).unless({path: ['/', '/register','/register/auth/facebook/token']}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));

app.use('/', index);
app.use('/users', users);
app.use('/register',register);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
