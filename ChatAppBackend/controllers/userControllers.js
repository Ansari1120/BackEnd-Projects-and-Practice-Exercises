const asyncHanlder = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../helpers/generateToken");
const bcrypt = require("bcryptjs");

const registerUser = asyncHanlder(async (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      status: 400,
      message: "Please Fill all fields (email,password,name)",
      data: null,
    });
    throw new Error(`Please Provide all fields`);
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400).json({
      status: 400,
      message: "User with this email already exist.",
      data: null,
    });
    throw new Error("User with this email already exist.");
  }

  // Hash the password before creating the user
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("pass", hashedPassword);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profilePicture,
  });

  if (user) {
    res.status(201).json({
      status: 200,
      message: "User created Successfully",
      data: {
        _id: user._Id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400).json({
      status: 400,
      message: "Something went wrong while creating user.",
      data: null,
    });
    throw new Error("Something went wrong while creating user.");
  }
});

const loginUser = asyncHanlder(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({
      status: 401,
      message: "Invalid email or password",
      data: null,
    });
    throw new Error("Invalid email or password");
  }
});

const allUsers = asyncHanlder(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  let users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  if (users && users.length > 0) {
    res.status(200).send({
      status: 200,
      message: "Data Found",
      data: users,
    });
  } else {
    res.status(400).send({
      status: 400,
      message: "Data Not Found.",
      data: null,
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
  allUsers,
};
