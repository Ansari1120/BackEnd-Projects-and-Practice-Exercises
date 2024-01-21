const wbm = require("wbm");
var dotenv = require("dotenv");
dotenv.config();

const whatsApp = async (phoneNumber, message) => {
  try {
    wbm
      .start()
      .then(async () => {
        const phones = [phoneNumber];
        await wbm.send(phones, message);
        await wbm.end();
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

module.exports = whatsApp;
