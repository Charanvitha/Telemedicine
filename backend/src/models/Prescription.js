import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true }
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true, unique: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medicines: [medicineSchema],
    notes: String,
    pdfUrl: String
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
