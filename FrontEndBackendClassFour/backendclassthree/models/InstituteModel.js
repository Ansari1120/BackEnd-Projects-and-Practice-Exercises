const mongoose = require("mongoose");

const InstituteModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
  },
  tel: {
    type: Number,
    required: true,
  },
});

const InstituteSchema = mongoose.model("Institute", InstituteModel);

module.exports = InstituteSchema;
