const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo DB Connected : ${connection.connection.host}`);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
