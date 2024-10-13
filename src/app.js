const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();

//init midelewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
//init db

//init routes
app.get("/", (req, res, next) => {
  const strCompress = "Hello World";
  return res.status(200).json({
    message: "Welcome to the API",
    metadata: strCompress.repeat(10000),
  });
});
//handle errors

module.exports = app;
