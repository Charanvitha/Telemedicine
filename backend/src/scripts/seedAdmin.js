import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
if (existing) {
  console.log("Admin already exists");
  process.exit(0);
}

await User.create({
  name: process.env.ADMIN_NAME || "Platform Admin",
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: "admin"
});

console.log("Admin created");
process.exit(0);
