const mongoose = require("mongoose");
const Joi = require("joi");

 Joi.objectId = require('joi-objectid')(Joi);
// const {userSchema} = require('./user'); 
// const {productSchema} = require('./product');

const cartSchema = new mongoose.Schema({
  products: {
    type:mongoose.Schema.Types.ObjectId,  
    required: true,
    ref:'Product',
  },
  qunt: {
    type: Number,
  required: true,
  },
  // users: { 
  //   type: userSchema,  
  //   required: true
 
  // },
  
});



const Cart  = mongoose.model("Cart", cartSchema);

function validateCart(cart) {
  const schema = Joi.object({
    productId: Joi.objectId().required(),
    qunt: Joi.number().required(),
    // userId: Joi.objectId().required(),

  });
  return (validate = schema.validate(cart));
}

exports.Cart = Cart;
exports.validate = validateCart;
