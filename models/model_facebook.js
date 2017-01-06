/**
 * Created by ananyagoel on 23/12/16.
 */

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var user= require('./model_user');

var facebook_data_schema = new schema({
    created_at:
        {
            type: Date
        },
    updated_at:
        {
            type:Date
        },
    user:
        {
            type:schema.ObjectId,
            ref:'user'
        },
    user_friends:
        {
            type:schema.Types.Mixed
        },
    facebook_id:
        {
            type:String
        }
});

// on every save, add the date
facebook_data_schema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


var facebook_data = mongoose.model('facebook_data', facebook_data_schema);

module.exports = facebook_data;