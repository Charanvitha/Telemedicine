import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import User from "../models/User.js";

// ✅ FIXED: use UTC time
const isWithinAvailability = (availability, scheduledAt) => {
  const day = scheduledAt.getDay();

  const hours = `${String(scheduledAt.getHours()).padStart(2, "0")}:${String(
    scheduledAt.getMinutes()
  ).padStart(2, "0")}`;

  return availability.some(
    (slot) =>
      slot.dayOfWeek === day &&
      hours >= slot.startTime &&
      hours < slot.endTime
  );
};

// ✅ CREATE APPOINTMENT
export const createAppointment = asyncHandler(async (req, res) => {
  const { doctorId, scheduledAt, reason } = req.body;

  const date = new Date(scheduledAt);

  // ✅ check doctor exists
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
    isApproved: true
  });

  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  // ✅ check availability
  const availability = await Availability.find({ doctor: doctorId });

  if (!availability.length || !isWithinAvailability(availability, date)) {
    res.status(400);
    throw new Error("Selected slot is unavailable");
  }

  // ✅ check duplicate slot
  const existing = await Appointment.findOne({
    doctor: doctorId,
    scheduledAt: date
  });

  if (existing) {
    res.status(400);
    throw new Error("This slot is already booked");
  }

  // ✅ create appointment
  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    scheduledAt: date,
    reason,
    roomId: uuidv4()
  });

  const populated = await appointment.populate([
    { path: "patient", select: "name email" },
    { path: "doctor", select: "name email specialization" }
  ]);

  res.status(201).json({
    success: true,
    appointment: populated
  });
});

// ✅ GET APPOINTMENTS
export const getAppointments = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "doctor"
      ? { doctor: req.user._id }
      : req.user.role === "patient"
      ? { patient: req.user._id }
      : {};

  const appointments = await Appointment.find(query)
    .populate("patient", "name email")
    .populate("doctor", "name email specialization")
    .sort({ scheduledAt: 1 });

  res.json({ success: true, appointments });
});

// ✅ UPDATE STATUS
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  const ownsAppointment =
    appointment.doctor.toString() === req.user._id.toString() ||
    appointment.patient.toString() === req.user._id.toString() ||
    req.user.role === "admin";

  if (!ownsAppointment) {
    res.status(403);
    throw new Error("Not allowed to update appointment");
  }

  appointment.status = req.body.status || appointment.status;

  await appointment.save();

  res.json({ success: true, appointment });
});
