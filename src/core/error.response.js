"use strict";

const statusCode = {
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
};
const reasonStatusCode = {
  FORBIDDEN: "Bad Request Error",
  CONFLICT: "Conflict Error",
  NOT_FOUND: "Not Found",
};
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");
const statusCodes = require("../utils/statusCodes");
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    status = statusCodes.FORBIDDEN
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    status = StatusCodes.FORBIDDEN
  ) {
    super(message, status);
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    status = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}
//Exporting the ErrorResponse class
module.exports = {
  ErrorResponse,
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
};
