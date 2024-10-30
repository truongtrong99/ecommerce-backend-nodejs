"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const RoleShop = {
  EDITOR: "EDITOR",
  SHOP: "SHOP",
  WRITER: "0001",
  ADMIN: "ADMIN",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //step 1: check if email already exists
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "XXX",
          message: "Shop already resgistered!",
          status: "error",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        // create privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });

        console.log({ privateKey, publicKey }); // save privateKey, publicKey to collection
      }
    } catch (error) {
      return {
        code: "XXX",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
