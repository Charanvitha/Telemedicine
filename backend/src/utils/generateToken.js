import jwt from "jsonwebtoken";
import { requireEnv } from "../config/env.js";

const generateToken = (userId, role) =>
  jwt.sign({ userId, role }, requireEnv("JWT_SECRET"), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

export default generateToken;
