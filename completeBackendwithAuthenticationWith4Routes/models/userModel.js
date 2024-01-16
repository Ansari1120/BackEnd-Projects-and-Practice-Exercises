const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  oldPassword: {
    type: String,
  },
  newPassword: {
    type: String,
  },
  registrationStatus: {
    type: Boolean,
    default: false,
  },
  resettoken: { type: String, required: false },
  resettokenExpiration: { type: Date, required: false },
});

module.exports = mongoose.model("users", userSchema);
