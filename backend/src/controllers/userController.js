import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getDoctors = asyncHandler(async (_req, res) => {
  const doctors = await User.find({ role: "doctor", isApproved: true }).select("-password");
  res.json({ success: true, doctors });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const fields = ["name", "phone", "bio", "specialization", "experience", "avatar"];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();
  res.json({ success: true, user: await User.findById(user._id).select("-password") });
});
