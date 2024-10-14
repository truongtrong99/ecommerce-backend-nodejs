"use strict";

const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/shopDEV";
const { countConnect } = require("../helper/check.connect");

class DataBase {
  constructor() {
    this.connect();
  }

  connect() {
    if (1 == 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(uri)
      .then(() => {
        console.log("Connected to MongoDB PRO", countConnect());
      })
      .catch((err) => console.log(err));
  }

  static getInstance() {
    if (!DataBase.instance) {
      DataBase.instance = new DataBase();
    }

    return DataBase.instance;
  }
}

const instance = DataBase.getInstance();

module.exports = instance;