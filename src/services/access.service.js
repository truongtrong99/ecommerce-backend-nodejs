"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { type } = require("os");
const { format } = require("path");
const { getInfoData } = require("../utils");
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
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        // create privateKey, publicKey
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });
        // another way to generate key pair
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        //pkcs1 is Public Key Cryptography Standards 1
        console.log({ privateKey, publicKey }); // save privateKey, publicKey to collection

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxxx",
            message: "keyStore error",
          };
        }
        // const publicKeyObject = crypto.createPublicKey(publicKeyString);

        // console.log(`publicKeyObject:: ${publicKeyObject}`);
        // create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log(`created Token success:: ${tokens}`);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
        // const tokens =
      }

      return {
        code: 200,
        metadata: null,
      };
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
