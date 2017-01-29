/**
 * Created by ananyagoel on 30/01/17.
 */


var mongoose = require('mongoose');
var schema = mongoose.Schema;
var validators = require('mongoose-validators');

var recipe_schema = new schema({

    created_at:
        {
            type: Date
        },
    updated_at:
        {
            type:Date
        },
    number_of_steps:
        {
            type:Number,
            validate:validators.isNumeric()
        },
    description:
        {
            type:schema.Types.Mixed
        },
    what_you_need:
        {
            type:schema.Types.Mixed
        },
    what_you_get:
        {
            type:schema.Types.Mixed
        },
    cooking_time:
        {
            type:schema.Types.Mixed
        },
    recipe_procedure:
        {
            type:schema.Types.Mixed
        },
    difficulty:
        {
            type:String
        },
    dish_name:
        {
            type:String,
            trim:true,
            unique:true,
            sparse:true,
            required:true,
        }
});



// on every save, add the date
recipe_schema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

recipe_schema.index({dish_name:1},{unique:true,sparse:true});

var recipe = mongoose.model('recipe', recipe_schema);

module.exports = recipe;