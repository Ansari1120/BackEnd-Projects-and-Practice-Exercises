const nodemailer = require("nodemailer");
var dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (email, serviceName, message) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: false,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.GMAIL,
      to: email,
      subject: `${serviceName}`,
      text: `${message}`,
      html: `<b>${message}<b/>`,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
