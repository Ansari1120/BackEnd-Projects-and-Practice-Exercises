const generateRandomToken = (length = 5) => {
  if (length <= 0) {
    throw new Error("Token length must be greater than zero.");
  }

  let randomToken = "";
  const characters = "0123456789"; // The characters to choose from for the token
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomToken += characters.charAt(randomIndex);
  }

  return randomToken;
};

module.exports = generateRandomToken;
