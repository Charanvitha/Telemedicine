import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Availability from "../models/Availability.js";

dotenv.config();
await connectDB();

const demoDoctors = [
  {
    name: "Dr Aisha Raman",
    email: "aisha.raman@telemed.local",
    password: "Doctor@123",
    role: "doctor",
    phone: "9876543210",
    specialization: "Neurology",
    bio: "Diagnoses and treats migraines, seizures, nerve disorders, and other neurological conditions.",
    experience: 11
  },
  {
    name: "Dr Arjun Mehta",
    email: "arjun.mehta@telemed.local",
    password: "Doctor@123",
    role: "doctor",
    phone: "9876543211",
    specialization: "Cardiology",
    bio: "Focuses on heart health, blood pressure management, and long-term cardiac care.",
    experience: 8
  },
  {
    name: "Dr Kavya Reddy",
    email: "kavya.reddy@telemed.local",
    password: "Doctor@123",
    role: "doctor",
    phone: "9876543212",
    specialization: "Gynecology",
    bio: "Provides women's health consultations, reproductive care, and routine gynecological support.",
    experience: 9
  },
  {
    name: "Dr Neel Joshi",
    email: "neel.joshi@telemed.local",
    password: "Doctor@123",
    role: "doctor",
    phone: "9876543213",
    specialization: "Dermatology",
    bio: "Treats acne, allergies, rashes, and chronic skin conditions with tailored care plans.",
    experience: 13
  },
  {
    name: "Dr Priya Nair",
    email: "priya.nair@telemed.local",
    password: "Doctor@123",
    role: "doctor",
    phone: "9876543214",
    specialization: "General Medicine",
    bio: "Handles primary care consultations, follow-ups, and chronic condition guidance.",
    experience: 10
  },
  {
    name: "Dr Rohan Kapoor",
    email: "rohan.kapoor@telemed.local",
    password: "Doctor@123",
    role: "doctor",
    phone: "9876543215",
    specialization: "Psychiatry",
    bio: "Provides mental health consultations, therapy guidance, and medication follow-up.",
    experience: 7
  },
  {
    name: "Dr Sana Iyer",
    email: "sana.iyer@telemed.local",
    password: "Doctor@123",
    role: "doctor",
    phone: "9876543216",
    specialization: "Pediatrics",
    bio: "Supports infants, children, and teens with compassionate pediatric care.",
    experience: 6
  }
];

const defaultAvailability = [
  { dayOfWeek: 0, startTime: "10:00", endTime: "13:00", slotDurationMinutes: 30 },
  { dayOfWeek: 1, startTime: "09:00", endTime: "13:00", slotDurationMinutes: 30 },
  { dayOfWeek: 2, startTime: "10:00", endTime: "14:00", slotDurationMinutes: 30 },
  { dayOfWeek: 3, startTime: "11:00", endTime: "15:00", slotDurationMinutes: 30 },
  { dayOfWeek: 4, startTime: "09:30", endTime: "13:30", slotDurationMinutes: 30 },
  { dayOfWeek: 5, startTime: "14:00", endTime: "18:00", slotDurationMinutes: 30 },
  { dayOfWeek: 6, startTime: "10:00", endTime: "13:00", slotDurationMinutes: 30 }
];

for (const doctor of demoDoctors) {
  await User.updateOne(
    { email: doctor.email },
    { $set: { ...doctor, isApproved: true } },
    { upsert: true }
  );

  const savedDoctor = await User.findOne({ email: doctor.email });
  await Availability.deleteMany({ doctor: savedDoctor._id });
  await Availability.insertMany(
    defaultAvailability.map((slot) => ({
      doctor: savedDoctor._id,
      ...slot
    }))
  );
}

console.log("Demo doctors and availability seeded successfully");
process.exit(0);
