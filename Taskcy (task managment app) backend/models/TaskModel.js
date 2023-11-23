const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  DueDate: {
    type: Date,
    required: true,
  },
  Priority: {
    type: String, // You can use an enum for priority levels if needed
    required: true,
  },
  Status: {
    type: String, // You can use an enum for task statuses if needed
    required: true,
  },
  CreatedDate: {
    type: Date,
    default: Date.now,
  },
  UpdatedDate: {
    type: Date,
    default: Date.now,
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
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", // Reference to the Project model
    required: true,
  },
  Labels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Label",
    },
  ],
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
