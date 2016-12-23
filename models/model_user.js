/**
 * Created by ananyagoel on 12/12/16.
 */


//TODO: finalise fb login + indexing enabling
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var user_schema = new schema({

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
        trim:true,
        unique:true},
    extension :
    {
        type:String,
        trim:true,
        default:"+91"
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
    fcm_toke :
    {
        type:String,
    },
    facebook_id:
    {
        type:String,
        unique:true,
        required:true
    },
    facebook:{
        id:
        {
            type:String,
            trim:true,
            unique:true,
            required:true
        },
        token:
        {
            type:String,
            required:true
        },
        display_name :{
            type:String
        },
        email : {
            type:String,
            required:true,
            unique:true
        },
        user_friends_count :
        {
            type:String
        },
        gender:
            {
                type:String
            },
        user_likes:
            {
                type:schema.Types.Mixed

            }

    },
    mobile_verified:
    {
        type:Boolean,
        default:false
    },
    email_verified:
    {
        type:Boolean,
        default:false
    },
    email:
        {
            type:String,
            trim:true,
            unique:true,
            required:true
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



user_schema.index({ email: 1, type: -1 }); // schema level

var user = mongoose.model('user', user_schema);

module.exports = user;
