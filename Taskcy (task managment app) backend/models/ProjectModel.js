const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  creatorUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Reference to the User model
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // Reference to the Task model
    },
  ],
  Labels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectLabel",
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
