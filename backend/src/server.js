import http from "http";
import "./config/env.js";
import connectDB from "./config/db.js";
import app from "./app.js";
import { initSocket } from "./config/socket.js";

await connectDB();

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
