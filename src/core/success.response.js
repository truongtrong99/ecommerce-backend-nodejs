"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
};
const ReasonStatusCode = {
  CREATED: "Created",
  OK: "Success",
};
class SuccessResponse {
  constructor({
    message,
    status = StatusCode.OK,
    reasonStatus = ReasonStatusCode.OK,
    metadata,
  }) {
    this.message = !message ? reasonStatus : message;
    this.status = status;
    this.reasonStatus = reasonStatus;
    this.metadata = metadata;
  }

  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    status = StatusCode.CREATED,
    metadata,
    options = {},
  }) {
    super({
      message,
      status: status,
      reasonStatus: ReasonStatusCode.CREATED,
      metadata,
    });
    this.options = options;
  }
}

//Exporting the classes
module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
