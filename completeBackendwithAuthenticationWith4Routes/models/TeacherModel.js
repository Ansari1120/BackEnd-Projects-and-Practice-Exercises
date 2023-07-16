const mongoose = require("mongoose");

const TeacherModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
});

const TeacherSchema = mongoose.model("Teacher", TeacherModel);

module.exports = TeacherSchema;
