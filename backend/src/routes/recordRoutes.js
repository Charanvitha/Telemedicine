import express from "express";
import { createRecord, getPatientRecords } from "../controllers/recordController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), createRecord);
router.get("/", protect, getPatientRecords);
router.get("/me", protect, authorize("patient"), getPatientRecords);
router.get("/:patientId", protect, authorize("doctor", "admin"), getPatientRecords);

export default router;
