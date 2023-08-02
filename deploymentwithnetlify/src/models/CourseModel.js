const mongoose = require("mongoose");

const CourseModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  fees: {
    type: Number,
    require: true,
  },
  shortName: {
    type: String,
    required: true,
  },
});

const CourseSchema = mongoose.model("Course", CourseModel);

module.exports = CourseSchema;
