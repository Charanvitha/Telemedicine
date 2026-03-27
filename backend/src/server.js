import dotenv from "dotenv";
dotenv.config();

import http from "http";
import cors from "cors"; // ✅ ADD THIS
import connectDB from "./config/db.js";
import app from "./app.js";
import { initSocket } from "./config/socket.js";

// ✅ APPLY CORS BEFORE ANYTHING
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://telemedicine-steel.vercel.app"
  ],
  credentials: true
}));

await connectDB();

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});