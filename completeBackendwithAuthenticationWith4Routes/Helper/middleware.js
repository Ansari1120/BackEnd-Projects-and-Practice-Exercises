const jwt = require("jsonwebtoken");
const sendResponse = require("./Helper");
var dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  // Check for the presence of API access key in headers
  const apiKey = req.headers["api-key"];
  if (apiKey !== process.env.SECURE_KEY) {
    return res
      .status(401)
      .send(sendResponse(false, null, "API access key is missing"));
  }

  // Check for the presence of authentication token in headers
  let authToken = req.headers["authorization"];
  if (!authToken) {
    return res
      .status(401)
      .send(sendResponse(false, null, "Authentication token is missing"));
  }

  authToken = authToken.split(" ")[1];
  // Verify the authentication token
  jwt.verify(authToken, process.env.SECURE_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send(sendResponse(false, null, "Invalid authentication token"));
    }

    // Set the decoded user information in the request for further use
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  });
};

module.exports = authMiddleware;
