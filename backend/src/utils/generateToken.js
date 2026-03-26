import jwt from "jsonwebtoken";

const generateToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

export default generateToken;
