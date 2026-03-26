import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname.replace(/\s+/g, "-")}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});
