const mongoose = require("mongoose");

const projectlabelSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Color: {
    type: String,
    required: true,
  },
  ProjectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const Label = mongoose.model("ProjectLabel", projectlabelSchema);

module.exports = Label;
