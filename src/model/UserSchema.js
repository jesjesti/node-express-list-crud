"use strict";

var mongoose = require("mongoose");
Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
  userName: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("User", UserSchema);
