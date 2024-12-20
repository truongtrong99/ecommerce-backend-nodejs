"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    // v1
    // new SuccessResponse({
    //   message: "Get token successfully",
    //   metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res);

    // v2 fix bug, no need accessToken
    new SuccessResponse({
      message: "Get token successfully!",
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    // return res.status(200).json({
    //   message: "Sign up successfully",

    // })
    new CREATED({
      message: "Sign up successfully",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
