const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const { Product, validate } = require("../models/product");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { User } = require("../models/user");

const router = express.Router();

router.get("/check", auth, async (req, res) => {
  // res.send("hii");
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
router.get("/serch", async (req, res) => {
  const pageNumber=2
      const pageSize=1
  const product = await Product.find().sort("prod_name").skip((pageNumber>=0) * pageSize).limit(pageSize)
  res.send(product);
});
router.post("/add", auth, async (req, res) => {
  // console.log("sdfsd");
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.body.userId);
  // console.log(user);
  let product =await Product.findOne({prod_name:req.body.prod_name});

  if (product) return res.status(400).send("User can regisert one product .");

  product = new Product({
    prod_name: req.body.prod_name,
    prod_description: req.body.prod_description,
    users: {
      _id: user._id,
    
    },
    price:req.body.price,
  });
  await product.save();
  res.send(product);
});

router.post("/price",auth, async (req, res) => {
  // res.send("hii");
  //  product = await Product.find({price :$in [20,50]}).select("price");
  // res.send(product);
});


router.post("/pagination",auth,async (req, res) => {
  res.send("hii");
  //     const pageNumber=2
  //     const pageSize=10

  //  user = await User.find().sort("name")
  //   .skip((pageNumber-2) * pageSize)
  //   .limit(pageSize)
//  product = await Product.find().sort("prod_name");
 
//   res.send(product);
});


module.exports = router;
