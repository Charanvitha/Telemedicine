import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDurationMinutes: { type: Number, default: 30 }
  },
  { timestamps: true }
);

availabilitySchema.index({ doctor: 1, dayOfWeek: 1, startTime: 1 }, { unique: true });

export default mongoose.model("Availability", availabilitySchema);
