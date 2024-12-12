require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();
//init midelewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//init db
require("./dbs/init.mongodb");
// const { checkOverLoad } = require("./helper/check.connect");
// checkOverLoad();
//init routes

app.use("/", require("./routes"));
//handle errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({
    status: "error",
    code: status,
    message: error.message || "Internal Server Error",
  });
});
module.exports = app;
