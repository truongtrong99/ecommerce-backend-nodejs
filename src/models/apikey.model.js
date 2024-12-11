"use strict";

// create a new model for the API key with new Schema
const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "Apikeys";

const apiKeySchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true },
    permissions: [
      { type: [String], required: true, enum: ["0000", "1111", "2222"] },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
