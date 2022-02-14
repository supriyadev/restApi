const users = require("./routes/users");
const config = require("config");
const auth = require("./routes/auth");
const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const app = express();

// scecret key
if (!config.get("jwttokenkey")) {
  console.error("FATAL ERROR: jwttokenkey is not defined.");
  process.exit(1);
}
//promise fuction then and catch
mongoose
  .connect("mongodb://localhost/Users-info")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

// middlewares
app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth", auth);

//server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
