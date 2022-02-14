const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const config = require("config");
const { route } = require("./users");
const router = express.Router();
// console.log('hello');

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("INVALID EMAIL");

  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).send("INVALID EMAIL and paasord");

  const token = user.generateAuthToken();
  res.send(token);
  // user =new User({
  //    name:req.body.name,
  //    email:req.body.email,
  //    password:req.body.password

  // });// repeating req.body we can use _ lodash using pick []method

  //     user = new User(_.pick(req.body, ['name', 'email', 'password']));
  //     const salt = await bcrypt.genSalt(10);
  //     user.password = await bcrypt.hash(user.password, salt);
  //    await user.save();
  //     res.send(user);

  // const token = user.generateAuthToken();
  // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});
function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(20).required(),
  });
  return schema.validate(req);
}

module.exports = router;
