import express from "express";
import { body } from "express-validator";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/", getAppointments);

router.post("/", createAppointment);

// ✅ SPECIFIC route FIRST
router.put("/:id/status", updateAppointmentStatus);

// ❌ generic later (if exists)
// router.put("/:id", somethingElse);

router.put("/test", (req, res) => {
  res.send("PUT WORKING");
});

export default router;
