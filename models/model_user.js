/**
 * Created by ananyagoel on 12/12/16.
 */


var mongoose = require('mongoose');
var schema = mongoose.Schema;
var facebook_data =require('./model_facebook');
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
        unique:true,
        index:true,
        sparse:true
        },
    extension :
        {
        type:String,
        trim:true,
        default:"+91"
    },
    first_name :
        {
        type: String,
        trim:true
        },
    last_name :
        {
        type: String,
        trim:true
    },
    fcm_token :
        {
        type:String,
    },
    facebook_id:
        {
        type:String,
        unique:true,
        required:true,
        index:true
        },
    gender:
        {
            type:String
        },
    facebook: {
        id:
            {
            type: String,
            unique: true,
            required: true,
            index:true
            },
        token:
            {
            type: String,
            required: true
        },
        facebook_data:
            {
                type: schema.ObjectId,
                ref: 'facebook_data'
            },
        long_access_token:
            {
                type:String
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
            sparse:true
        },
    is_new_user:
        {
            type:Boolean,
            default:true
        },
    description :
        {
            type:String,
            trim:true,
    },
    birthday:
        {
        type:String
        },
    user_image_url:
        {
          type:String
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



// user_schema.index({ email: 1, type: -1 }); // schema level
user_schema.index({mobile_number:1,facebook_id:1,email:1},{unique:true,sparse:true});



var user = mongoose.model('user', user_schema);

module.exports = user;
