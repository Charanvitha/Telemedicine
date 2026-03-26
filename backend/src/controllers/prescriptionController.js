import path from "path";
import asyncHandler from "express-async-handler";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import { generatePrescriptionPdf } from "../utils/pdfGenerator.js";

export const createPrescription = asyncHandler(async (req, res) => {
  const { appointmentId, medicines, notes } = req.body;
  const appointment = await Appointment.findById(appointmentId).populate("patient doctor");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (appointment.doctor._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the assigned doctor can create a prescription");
  }

  let prescription = await Prescription.findOne({ appointment: appointmentId });

  if (prescription) {
    prescription.medicines = medicines;
    prescription.notes = notes;
  } else {
    prescription = await Prescription.create({
      appointment: appointmentId,
      doctor: appointment.doctor._id,
      patient: appointment.patient._id,
      medicines,
      notes
    });
  }

  await prescription.save();
  const pdfFileName = `${prescription._id}-${Date.now()}.pdf`;
  const filePath = await generatePrescriptionPdf({
    prescription,
    patient: appointment.patient,
    doctor: appointment.doctor,
    appointment,
    fileName: pdfFileName
  });

  prescription.pdfUrl = `/prescriptions/${path.basename(filePath)}`;
  await prescription.save();

  res.status(201).json({ success: true, prescription });
});

export const getMyPrescriptions = asyncHandler(async (req, res) => {
  const query = req.user.role === "doctor" ? { doctor: req.user._id } : { patient: req.user._id };
  const prescriptions = await Prescription.find(query)
    .populate("doctor", "name specialization")
    .populate("patient", "name")
    .populate("appointment", "scheduledAt status");

  res.json({ success: true, prescriptions });
});
