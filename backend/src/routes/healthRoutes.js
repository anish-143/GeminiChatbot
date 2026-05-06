import express from "express";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date(),
  });
});

export default router;
