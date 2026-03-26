import asyncHandler from "express-async-handler";
import MedicalRecord from "../models/MedicalRecord.js";

export const createRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.create({
    patient: req.user.role === "patient" ? req.user._id : req.body.patientId,
    appointment: req.body.appointmentId,
    title: req.body.title,
    description: req.body.description,
    type: req.body.type || "report",
    fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined
  });

  res.status(201).json({ success: true, record });
});

export const getPatientRecords = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "patient"
      ? { patient: req.user._id }
      : req.params.patientId
        ? { patient: req.params.patientId }
        : {};

  const records = await MedicalRecord.find(query)
    .populate("patient", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, records });
});
