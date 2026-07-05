const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");

const {
  createCronJob,
  getCronJobs,
} = require("../controllers/cronController");

router.post("/", protect, createCronJob);

router.get("/", protect, getCronJobs);

module.exports = router;