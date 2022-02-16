const _ = require("lodash");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const config = require("config");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
//for check the auth
router.get("/check", auth, async (req, res) => {
  // res.send("hii");
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//insert user data
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //findone email
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  // checked confirm and password same
  if (req.body.password !== req.body.confirmpassword)
    return res.status(400).send("confirm password and password are not same");

  // repeating req.body we can use _ lodash using pick []method
  user = new User(
    _.pick(req.body, ["name", "email", "password", "phonenumber"])
  );
  const salt = await bcrypt.genSalt(10); //bcrypt is used for password
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  // res.send(user);

  const token = user.generateAuthToken();
  // const token = jwt.sign({_id:user.id},config.get('jwttokenkey'));
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});
//update user data
router.put("/:id", auth, async (req, res) => {
  users = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    { new: true }
  );

  if (!users)
    return res.status(404).send("The users with the given ID was not found.");

  res.send(users);
});
//delete data
router.delete("/:id", async (req, res) => {
  const users = await User.findByIdAndRemove(req.params.id);

  if (!users)
    return res.status(404).send("The users with the given ID was not found.");

  res.send(users);
});

module.exports = router;
