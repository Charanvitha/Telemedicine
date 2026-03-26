import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

await User.deleteMany({
  role: "doctor",
  $or: [
    { name: "Dr John" },
    { email: /@telemed\.local$/i }
  ]
});

console.log("Old demo doctors removed");
process.exit(0);
