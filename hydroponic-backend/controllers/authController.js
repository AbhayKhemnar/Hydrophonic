const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  location: user.location,
  contact: user.contact,
  subscriptionStatus: user.subscriptionStatus,
  isActive: user.isActive
});

const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    location,
    contact
  } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password and role are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    location,
    contact
  });

  return res.status(201).json({
    message: "User registered successfully",
    token: generateToken(user),
    user: sanitizeUser(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  return res.json({
    token: generateToken(user),
    user: sanitizeUser(user)
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.location = req.body.location || user.location;
  user.contact = req.body.contact || user.contact;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  res.json({
    message: "Profile updated",
    user: sanitizeUser(user)
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
