import express from "express";
import { createPrescription, getMyPrescriptions } from "../controllers/prescriptionController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyPrescriptions);
router.post("/", protect, authorize("doctor"), createPrescription);

export default router;
