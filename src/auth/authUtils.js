"use strict";
const JWT = require("jsonwebtoken");
const asyncHandler = require("../helper/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

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

const authentication = asyncHandler(async (req, res, next) => {
  /* 
    1- check userId missing????
    2- get access token
    3- verify refresh token
    4- check user in database
    5- check keyStore with this userId
    6- Ok all => return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request");
  }
  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("KeyStore not found");
  }
  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request");
  }
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid userId");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /* 
    1- check userId missing????
    2- get access token
    3- verify refresh token
    4- check user in database
    5- check keyStore with this userId
    6- Ok all => return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request");
  }
  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("KeyStore not found");
  }
  //3
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError("Invalid userId");
      }
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request");
  }
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid userId");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  const decode = JWT.verify(token, keySecret);
  return await decode;
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2
};
