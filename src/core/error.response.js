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

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = reasonStatusCode.CONFLICT,
    status = statusCode.FORBIDDEN
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = reasonStatusCode.CONFLICT,
    status = statusCode.FORBIDDEN
  ) {
    super(message, status);
  }
}

//Exporting the ErrorResponse class
module.exports = {
  ErrorResponse,
  ConflictRequestError,
  BadRequestError,
};
