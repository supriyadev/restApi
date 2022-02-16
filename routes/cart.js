const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const { Product, validate } = require("../models/product");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
// const { User } = require("../models/user");
const { Cart } = require("../models/cart");
const router = express.Router();
router.post("/", async (req, res) => {
 

  // const user = await User.findById(req.body.userId);
 
  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Plese login first");
  

  // console.log("hii");

  cart = new Cart({
    products: {
      _id: product._id,
     
    },
    qunt: req.body.qunt,
  
  });
  
  await cart.save();
  res.send(cart);
});
module.exports = router;