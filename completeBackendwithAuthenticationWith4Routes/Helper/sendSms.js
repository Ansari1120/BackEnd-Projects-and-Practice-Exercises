const nodemailer = require("nodemailer");
var dotenv = require("dotenv");
dotenv.config();

const sendSMS = async (phoneNumber, message) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      //  host: "smtp.gmail.com",
      //  secure: false,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const smsAddress = `${phoneNumber}@carrier-email-gateway`; // Replace carrier-email-gateway with the appropriate domain
    const mailOptions = {
      from: process.env.GMAIL, // Replace with your Gmail email address
      to: smsAddress,
      subject: "Verification Code",
      text: `Your verification code is: ${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // await transporter.sendMail({
    //   from: process.env.GMAIL,
    //   to: email,
    //   subject: `${serviceName}`,
    //   text: `${message}`,
    //   html: `<b>${message}<b/>`,
    // });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendSMS;
