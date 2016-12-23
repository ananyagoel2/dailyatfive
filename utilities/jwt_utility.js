/**
 * Created by ananyagoel on 23/12/16.
 */


var config   = require("../config/config");
var Promise  = require('bluebird');
var jwt      = Promise.promisifyAll(require('jsonwebtoken'));


var createToken = function (payload) {
    console.log("Creating token");
    return jwt.signAsync(payload, config.JWT_secret_key, {
        algorithm: 'HS256',
        expiresIn: config.JWT_expiration_delta,
        issuer: 'dafive'
    });
};

var generatePayload = function (user) {
    console.log("Generate Payload");
    return {
        user_id: user._id,
        admin: user.admin
    };
};

var verifyToken = function (token) {
    console.log("Verify token");
    console.log(token);
    return jwt.verify(token, config.JWT_secret_key);
};

var decodeToken = function(token){
    console.log('decoding token.');
    return jwt.decode(token);
};

module.exports = {
    createToken: createToken,
    generatePayload: generatePayload,
    verifyToken: verifyToken,
    decodeToken: decodeToken
};