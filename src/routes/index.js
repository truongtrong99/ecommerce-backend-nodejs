"use strict";

const express = require("express");
const router = express.Router();

router.use("/v1/api", require("./access"));
// router.get("", (req, res, next) => {
//   return res.status(200).json({
//     code: "20001",
//     message: "Welcome to the API",
//   });
// });
module.exports = router;
