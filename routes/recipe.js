/**
 * Created by ananyagoel on 30/01/17.
 */

var express = require('express');
var router = express.Router();
var recipe_m= require('../models/model_recipe');
var _= require('lodash');
var config = require('../config/config');

router.route('/')
    .get( function(req, res, next) {
    recipe_m.find(function (err, recipe) {
        if (err) return next(err);
        res.json(recipe);
    });
})
    .post(function (req, res) {
        recipe_m.findOne({dish_name:req.params.dish_name},function (err, recipe) {
            if(err){
                res.status('400').send(err);
            }
            else{
                if(recipe)
                {
                    res.status(400).send({message:"Recipe exists!"})
                }
                else{
                    var new_recipe = recipe_m({
                        dish_name:req.body.dish_name,
                        number_of_steps:req.body.number_of_steps,
                        description:req.body.description,
                        what_you_need:req.body.what_you_need,
                        what_you_get:req.body.what_you_get,
                        cooking_time:req.body.cooking_time,
                        recipe_procedure:req.body.recipe_procedure,
                        difficulty:req.body.difficulty

                    });
                    new_recipe.save(function(err) {
                        if(err)
                        {
                            res.status('400').send(err);
                        }
                        else
                        {
                            recipe_m.findById(new_recipe._id,function (err, recipe) {
                                if (err){
                                    res.status(400).send({error:err})
                                }
                                else if(recipe)
                                {
                                    res.status(200).send(recipe)
                                }
                                else
                                {
                                    res.status(404).send({message:"Recipe not found!"})
                                }
                            })
                        }

                    })
                }
            }
        })
    });

router.route('/:recipe_id')
    .get(function (req, res) {
        recipe_m.findById(req.params.recipe_id,function (err, recipe) {
            if (err){
                res.status(400).send({error:err})
            }
            else if(recipe)
            {
                res.status(200).send(recipe)
            }
            else
            {
                res.status(404).send({message:"Recipe not found!"})
            }
        })
    })

module.exports = router;
