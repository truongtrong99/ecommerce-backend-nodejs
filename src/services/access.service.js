"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { type } = require("os");
const { format } = require("path");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
  EDITOR: "EDITOR",
  SHOP: "SHOP",
  WRITER: "0001",
  ADMIN: "ADMIN",
};
class AccessService {
  static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something went wrong !!! Please login again");
    }

    if (keyStore.refreshToken != refreshToken) {
      throw new AuthFailureError("Shop not registered");
    }
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError("Shop not registered");
    }

    // create new token pair
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // save the new refresh token used
      },
    });

    return {
      user,
      tokens,
    };
  };
  /*
    1- Check this token is used
   */
  static handlerRefreshToken = async (refreshToken) => {
    //step 1: check if token is used
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // if token is used
    if (foundToken) {
      ///decode token to verify
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log({ userId, email });
      // delete all token of this user
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something went wrong !!! Please login again");
    }
    // if token is not used
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError("Shop not registered");
    }

    // verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("[2]--", { userId, email });
    // check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError("Shop not registered");
    }

    // create new token pair
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // save the new refresh token used
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  /**
    1- Check email in database
    2- match password
    3- create access token and refresh token
    4- generate tokens
    5- get data return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    //step 1: check if email already exists
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Error: Shop not Registered");
    }
    //step 2: match password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Authentication Error");
    }
    //step 3: create access token and refresh token
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    //step 4: generate tokens
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });
    //step 5: get data return login
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    //step 1: check if email already exists
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Email already exists");
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
        // throw new BadRequestError("Error: Email already exists");
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
    // } catch (error) {
    //   return {
    //     code: "XXX",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessService;
