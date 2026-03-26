import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled"
    },
    reason: String,
    roomId: { type: String, required: true },
    notes: String
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, scheduledAt: 1 }, { unique: true });

export default mongoose.model("Appointment", appointmentSchema);
