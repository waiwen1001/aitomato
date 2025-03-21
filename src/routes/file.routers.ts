import { Router } from "express";
import asyncHandler from "express-async-handler";
import multer from "multer";
import { validateFileInput } from "../middleware/validation.middleware";
import { uploadFile } from "../controllers/file.controller";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const router = Router();

const uploadPath = "uploads/temp";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  "/upload",
  upload.single("file"),
  validateFileInput,
  asyncHandler(uploadFile)
);

export { router as fileRoutes };
