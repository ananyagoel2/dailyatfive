/**
 * Created by ananyagoel on 27/11/16.
 */
var mongoose= require('mongoose');
mongoose.Promise = global.Promise;

var mongoose_dev= require('./../database_config/database_dev');
var mongoose_staging = require('./../database_config/database_staging');
var mongoose_production = require('./../database_config/database_production')
//var crypto = require('crypto');

var developmentConfig = {
        upload_file_path: '/Users/ananyagoel/Desktop/dailyatfive/uploads/',
        static_path: '/Users/ananyagoel/Desktop/dailyatfive/uploads/',
        base_url: 'http://localhost:3000',
        options: mongoose_dev,
        url : "mongodb://localhost:27017/dev_db",
        CONFIG_ENV: 'development',
        PORT: '3000'
    },


    stagingConfig = {
        upload_file_path: '/home/daily/uploads/photos/',
        static_path: '/home/daily/uploads/',
        base_url: 'https://dev.dailyatfive.in',
        options: mongoose_staging,
        url : "mongodb://localhost:27017/staging_db",
        CONFIG_ENV: 'staging',
        PORT: '3001'
    },

    prodConfig = {
        upload_file_path: '/home/dexter/uploads/photos/new/',
        static_path: '/home/dexter/uploads/',
        base_url: 'https://master.dextra.xyz',
        options: mongoose_production,
        url : "mongodb://localhost:27017/production_db",
        CONFIG_ENV: 'production',
        PORT: '3002'
    };


var config = developmentConfig;
//var config = stagingConfig;
//var config = prodConfig;

config.https_link = config.base_url + '/uploads/photos/';
mongoose.connect(config.url, config.options)
    .then(function () {
        console.log("connected to "+config.CONFIG_ENV);
    }).catch(function (err) {
    console.log(err)
})

config.min_version_code = "1";
config.current_version_code = "1";

config.safeword= "dnEpflXiAZ";

config.JWT_secret_key = "xmbJLiOzQWqsYoHhMaf7";
config.JWT_expiration_delta = "60d"; // 100 days

config.msg91_auth_key = "106552ASqBUHY556efd867";
config.msg91_sender_id = "hmchef";
config.msg91_route_no = 4;

module.exports = config;
