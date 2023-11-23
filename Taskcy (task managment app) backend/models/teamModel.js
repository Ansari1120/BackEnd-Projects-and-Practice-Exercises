const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Logo: {
    type: String, 
    required: true,
  },
  CreatorUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  TeamMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference the User model
    },
  ],
});

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
