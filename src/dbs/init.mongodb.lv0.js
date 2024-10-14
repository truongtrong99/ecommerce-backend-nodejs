"use strict";

const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/shopDEV";

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
//dev
if (1 == 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
