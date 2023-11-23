const mongoose = require("mongoose");

const taskLabelAssociationSchema = new mongoose.Schema({
  TaskID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  LabelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Label",
    required: true,
  },
});

const TaskLabelAssociation = mongoose.model(
  "TaskLabelAssociation",
  taskLabelAssociationSchema
);

module.exports = TaskLabelAssociation;
