/**
 * Created by ananyagoel on 27/11/16.
 */

var mongoose_dev= require('./database_dev');
var mongoose_staging = require('./database_staging');
var mongoose_production = require('./database_production')
//var crypto = require('crypto');

var developmentConfig = {
        upload_file_path: '/Users/ananyagoel/Desktop/dailyatfive/uploads/',
        static_path: '/Users/ananyagoel/Desktop/dailyatfive/uploads/',
        base_url: 'http://localhost:3000',
        MONGO_CONFIG: mongoose_dev,
        CONFIG_ENV: 'development',
        PORT: '3000'
    },


    stagingConfig = {
        upload_file_path: '/home/daily/uploads/photos/',
        static_path: '/home/daily/uploads/',
        base_url: 'https://dev.dailyatfive.in',
        MONGO_CONFIG: mongoose_staging,
        CONFIG_ENV: 'staging',
        PORT: '3001'
    },

    prodConfig = {
        upload_file_path: '/home/dexter/uploads/photos/new/',
        static_path: '/home/dexter/uploads/',
        base_url: 'https://master.dextra.xyz',
        KNEX_CONFIG: mongoose_production,
        CONFIG_ENV: 'production',
        PORT: '3002'
    };


var config = developmentConfig;
//var config = stagingConfig;
//var config = prodConfig;

config.https_link = config.base_url + '/uploads/photos/';

config.min_version_code = "1";
config.current_version_code = "0";


//config.aes = {};
//config.aes.iv = 'vZIZU4wJS3zx1pK0';
//config.aes.key = '7219aa67d6a12836a9f6bed1a5e25eaa';
//config.aes.keyword = 'randomotpkeyyekptomodnar';

// config.smtpConfig = {
//     host: 'smtp.zoho.com',
//     port: 587,
//     requireTLS: true,
//     //secure: true,
//     auth: {
//         user: 'hi@dextra.xyz',
//         pass: 'zohodextra422'
//     }
// };
//
// config.JWT_SECRET_KEY = "xmbJLiOzQWqsYoHhMaf7";
// config.JWT_EXPIRATION_DELTA = "100d"; // 100 days
// config.BCRYPT_LOG_ROUNDS = 7; // 7 rounds
// config.ADMIN_IDS = [357, 385];
// config.SAFEWORD = "PQ19YKMdZC9392daLLh6";

module.exports = config;
