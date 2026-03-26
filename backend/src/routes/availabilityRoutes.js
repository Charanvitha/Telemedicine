import express from "express";
import { setAvailability, getDoctorAvailability } from "../controllers/availabilityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, setAvailability);
router.get("/:doctorId", getDoctorAvailability);

export default router;