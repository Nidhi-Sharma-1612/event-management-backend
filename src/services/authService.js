const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register a New User
const registerUser = async ({ name, email, phone, password }) => {
  if (await User.findOne({ email })) throw new Error("User already exists");
  if (await User.findOne({ phone }))
    throw new Error("Phone number already registered");

  const user = new User({ name, email, phone, password });
  await user.save();

  return { user, token: generateToken(user._id) };
};

// Login User
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid credentials");
  }

  return { user, token: generateToken(user._id) };
};

module.exports = { registerUser, loginUser };
