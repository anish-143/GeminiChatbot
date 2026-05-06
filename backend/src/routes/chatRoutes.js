import express from "express";
import multer from "multer";
import * as chatController from "../controllers/chatController.js";
import { validateFileType } from "../middleware/validation.js";

const router = express.Router();

// Configure multer for file uploads (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Chat routes
router.post("/chat", chatController.handleChatMessage);
router.post("/reset", chatController.resetChat);
router.get("/session/:sessionId", chatController.getChatSession);

// File upload routes
router.post(
  "/upload/document",
  upload.single("file"),
  validateFileType(["application/pdf", "text/plain"]),
  chatController.uploadDocument
);

router.post(
  "/upload/image",
  upload.single("file"),
  validateFileType(["image/png", "image/jpeg"]),
  chatController.uploadImage
);

export default router;
