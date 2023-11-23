const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Color: {
    type: String,
    required: true,
  },
  TaskID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
});

const Label = mongoose.model("Label", labelSchema);

module.exports = Label;
