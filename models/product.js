const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
 Joi.objectId = require('joi-objectid')(Joi);
const config = require("config");
const { string } = require("joi");
// const {userSchema} = require('./user'); 

const productSchema = new mongoose.Schema({
  prod_name: {
    type: String,
    required: true,
    maxlength: 20,
    minlength: 5,
  },
  prod_description: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  users: { 
    type:mongoose.Schema.Types.ObjectId,  
    required: true,
    ref:'User',
 
  },
  price:{
    type:Number,
  },
  image:{
    type:String,
    require:true,
  },
});



const Product  = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    prod_name: Joi.string().min(5).max(20).required(),
    prod_description: Joi.string().min(5).max(255).required(),
    userId: Joi.objectId().required(),
    price: Joi.number().required(),
    // image:Joi.string().required(),

  });
  return (validate = schema.validate(product));
}

exports.Product = Product;
exports.productSchema=productSchema;
exports.validate = validateProduct;
