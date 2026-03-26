import express from "express";
import { body } from "express-validator";
import { getProfile, login, register, getAllUsers } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["patient", "doctor"])
  ],
  validate,
  register
);
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], validate, login);
router.get("/me", protect, getProfile);

router.get("/all", getAllUsers);

export default router;
