"use strict";

const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const apiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers[HEADER.API_KEY]?.toString();
    if (!apiKey) {
      return res.status(403).json({ message: "Forbidden Error" });
    }
    // check API key
    const objKey = await findById(apiKey);
    console.log("objKey", objKey);
    if (!objKey) {
      return res.status(403).json({ message: "Forbidden Error" });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: "Permission Denied" });
    }
    console.log("permission", req.objKey.permissions);
    //check invalid permission
    const validPermission = req.objKey.permissions[0].includes(permission);
    if (!validPermission) {
      return res.status(403).json({ message: "Permission Denied" });
    }
    return next();
  };
};
// Export the module
module.exports = {
  apiKey,
  permission,
};
