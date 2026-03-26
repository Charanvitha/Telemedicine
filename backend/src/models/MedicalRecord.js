import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    title: { type: String, required: true },
    description: String,
    type: { type: String, enum: ["history", "report"], default: "report" },
    fileUrl: String
  },
  { timestamps: true }
);

export default mongoose.model("MedicalRecord", medicalRecordSchema);
