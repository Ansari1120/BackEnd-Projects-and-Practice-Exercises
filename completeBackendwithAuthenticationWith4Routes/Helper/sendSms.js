const twilio = require("twilio");
var dotenv = require("dotenv");
dotenv.config();

const client = twilio(process.env.Account_SID, process.env.AUTH_SMS_TOKEN);

const sendSMS = async (to, message) => {
  try {
    const verification = await client.verify.v2
      .services(process.env.VERIFY_SID)
      .verifications.create({ to, channel: "sms" });
    console.log(verification);
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

module.exports = sendSMS;
