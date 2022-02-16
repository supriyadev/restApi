const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
    minlength: 5,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    uniqui: true,
  },
  //for password more complixy use pakage
  confirmpassword: {
    type: String,
    maxlength: 255,
    minlength: 6,
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 6,
  },
  phonenumber: {
    type: String,
    required: true,
    maxlength: 10,
    minlength: 10,
  },
});

userSchema.methods.generateAuthToken = function () {
  //jwt  require 3 parameters() jwt.sign(payload, secretOrPrivateKey, [options, callback])
  const token = jwt.sign({ _id: this.id }, config.get("jwttokenkey")); //send secrate code to server
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(20).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(6).max(20).required(),
    confirmpassword: Joi.string().min(6).max(20),
    phonenumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  });
  return (validate = schema.validate(user));
}

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validateUser;
