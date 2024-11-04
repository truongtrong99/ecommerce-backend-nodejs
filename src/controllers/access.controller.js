"use strict"
const AccessService = require("../services/access.service");
class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(req.body);
      //200: OK
      //201: Created
      return res.status(201).json({
        code: "XXX",
        message: "Shop created successfully!",
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new AccessController();
