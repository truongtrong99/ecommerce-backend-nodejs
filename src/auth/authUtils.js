"use strict";
const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    // refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decoded verify::`, decoded);
      }
    });
    // return token pair
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return {
      code: "XXX",
      message: error.message,
      status: "error",
    };
  }
};

module.exports = {
  createTokenPair,
};
