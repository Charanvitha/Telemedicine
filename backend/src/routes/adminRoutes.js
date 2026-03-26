import express from "express";
import { deleteUser, getAnalytics, getUsers, updateUser } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/analytics", getAnalytics);
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
