const mongoose = require("mongoose");

const apiRequestSchema = new mongoose.Schema({
  name: { type: String },
  url: { type: String },
  method: {
    type: String,
    enum: ["GET", "POST", "PUT", "DELETE"],
    default: "GET",
    required: true,
  },
  headers: [
    {
      id: { type: String, },
      keyItem: { type: String,  },
      valueItem: { type: String,  },
    },
  ],
  body: { type: mongoose.Schema.Types.Mixed, default: null },
  auth: {
    type: {
      type: String,
      enum: ["None", "API Key", "Bearer Token"],
      default: "None",
    },
    apiKey: { 
      type: { key: String, value: String }, 
      default: null 
    },
    bearerToken: { type: String, default: null },
    basicAuth: { 
      username: { type: String, default: null }, 
      password: { type: String, default: null } 
    },
  },
}, { timestamps: true }); // Adds `createdAt` and `updatedAt` automatically

const apiCollectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  requests: [apiRequestSchema], 
}, { timestamps: true }); 
module.exports = mongoose.model("ApiCollection", apiCollectionSchema);
