/**
 * Created by ananyagoel on 12/12/16.
 */


//TODO: finalise fb login + indexing enabling
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var user_schema = new schema({
    email :
    {
        type:String,
        required:true,
        unique:true,
        trim:true,
        index: true
    },
    password :
    {
        type:String,
        required:true
    },
    created_at:
    {
        type: Date
    },
    updated_at:
    {
        type:Date
    },
    admin :
    {
        type:Boolean,
        default:false
    },
    mobile_number :
    {
        type:String,
        required:true,
        trim:true,
        unique:true,
        index: true
    },
    extension :
    {
        type:String,
        trim:true,
        required:true
    },
    first_name :
    {
        type: String,
        trim:true,
        required:true
    },
    last_name :
    {
        type: String,
        trim:true
    },
    facebook:{
        fbid:
        {
            type:String,
            trim:true
        },
        token:
        {
            type:String
        },
        displayName :{
            type:String
        },
        email : {
            type:String
        },
        profile_url :
        {
            type:String
        }

    }
});



// on every save, add the date
user_schema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

user_schema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

user_schema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

user_schema.index({ email: 1, type: -1 }); // schema level

var user = mongoose.model('user', user_schema);

module.exports = user;
