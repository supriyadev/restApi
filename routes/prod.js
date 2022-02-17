const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const { Product, validate } = require("../models/product");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { User } = require("../models/user");
const bodyParser= require('body-parser');
const nodemailer = require('nodemailer');
const multer  = require('multer')
// const upload = multer({ dest: './public/data/uploads/' })
const fs=require('fs');
const path=require('path');


const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/data/uploads/')
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      // console.log("filename " + file.originalname);
      cb(null,file.originalname)
      // cb(null, file.fieldname + '-' + uniqueSuffix)
      
    },
    fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "pdf" ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, and  format allowed!'));
    }
  },
  })
const upload = multer({ storage: storage });
// console.log(upload);
router.get("/check", auth, async (req, res) => {
  // res.send("hii");
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
router.get("/serch", async (req, res) => {
 const pageSize = 10;
    const currentPage = 1;
  const product = await Product.find().skip(pageSize * (currentPage - 1)).limit(pageSize)
  res.send(product);
});
router.post("/add",upload.single("image"), auth, async (req, res) => {
  // console.log(req.file.path);
  // console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.body.userId);
  // console.log(user);
  let product =await Product.findOne({prod_name:req.body.prod_name});

  if (product) return res.status(400).send("User can regisert one product .");
// var filename = req.file.filename; 
// console.log(filename);
// console.log(typeof req.file.path)
// console.log(req.file.originalname)

  product = new Product({
    prod_name: req.body.prod_name,
    prod_description: req.body.prod_description,
    users: {
      _id: user._id,
  },
    price:req.body.price,
    image:req.file.path,
  });
  await product.save();
  res.send(product);
});

router.get('/download',upload.single("image"),auth, async(req, res) => {
  const user = await User.findById(req.user._id);

  res.download(req.file.path);
});



router.get("/price", async (req, res) => {

   product = await Product.find({price :{$gte: 20, $lte: 50}}).select("price");
   res.send(product);
});


router.post("/pagination",auth,async (req, res) => {
 var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'supriyapandey9420@gmail.com',
    pass: ''
  }
});

var mailOptions = {
  from: 'supriyapandey9420@gmail.com',
  to: 'deveshtripathi900@gmai.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
 
});




module.exports = router;
