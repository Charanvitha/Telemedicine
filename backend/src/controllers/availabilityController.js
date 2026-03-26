import asyncHandler from "express-async-handler";
import Availability from "../models/Availability.js";

// ✅ SET AVAILABILITY
export const setAvailability = asyncHandler(async (req, res) => {
  const { slots } = req.body;

  await Availability.deleteMany({ doctor: req.user._id });

  const docs = await Availability.insertMany(
    slots.map((slot) => ({
      doctor: req.user._id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      slotDurationMinutes: slot.slotDurationMinutes || 30
    }))
  );

  res.json({ success: true, availability: docs });
});

// ✅ GET DOCTOR AVAILABILITY
export const getDoctorAvailability = asyncHandler(async (req, res) => {
  const availability = await Availability.find({
    doctor: req.params.doctorId
  }).sort({
    dayOfWeek: 1,
    startTime: 1
  });

  res.json({ success: true, availability });
});