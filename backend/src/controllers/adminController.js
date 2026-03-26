import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

export const getAnalytics = asyncHandler(async (_req, res) => {
  const [totalUsers, totalDoctors, totalPatients, totalAppointments, completedAppointments] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "doctor" }),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "completed" })
    ]);

  res.json({
    success: true,
    analytics: {
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      completedAppointments
    }
  });
});

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, users });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select(
    "-password"
  );
  res.json({ success: true, user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
});
