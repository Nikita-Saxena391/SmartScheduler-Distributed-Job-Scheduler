const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");

const {
  createQueue,
  getQueues,
  pauseQueue,
  resumeQueue,
} = require("../controllers/queueController");

router.post("/", protect, createQueue);

// Get all queues
router.get("/", protect, getQueues);

router.patch("/:id/pause", protect, pauseQueue);

router.patch("/:id/resume", protect, resumeQueue);

module.exports = router;