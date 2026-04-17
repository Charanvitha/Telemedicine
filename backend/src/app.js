import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
const apiRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/prescriptions", express.static(path.join(__dirname, "../prescriptions")));

app.get("/", (_req, res) => {
  res.send("API Running...");
});

apiRouter.get("/health", (_req, res) => {
  res.json({ success: true, message: "Telemedicine API is healthy" });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/appointments", appointmentRoutes);
apiRouter.use("/availability", availabilityRoutes);
apiRouter.use("/prescriptions", prescriptionRoutes);
apiRouter.use("/records", recordRoutes);
apiRouter.use("/admin", adminRoutes);

app.use(apiRouter);
app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
