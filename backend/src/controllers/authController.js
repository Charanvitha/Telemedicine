import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// ✅ Remove sensitive fields
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  specialization: user.specialization,
  bio: user.bio,
  experience: user.experience,
  isApproved: user.isApproved
});


// ✅ REGISTER
export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    specialization,
    bio,
    experience
  } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const user = await User.create({
    name,
    email,
    password, // ✅ model will hash it
    role,
    phone,
    specialization,
    bio,
    experience
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    user: sanitizeUser(user),
    token
  });
});


// ✅ LOGIN (ONLY ONE VERSION)
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id, user.role);

  res.json({
    success: true,
    user: sanitizeUser(user),
    token
  });
});


// ✅ GET PROFILE
export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};