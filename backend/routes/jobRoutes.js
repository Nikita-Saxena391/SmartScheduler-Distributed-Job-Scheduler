const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");

const {
    createJob,
    createBatchJobs,
    getJobs,
} = require("../controllers/jobController");

router.post("/", protect, createJob);

router.post("/batch", protect, createBatchJobs);
router.get("/", protect, getJobs);
module.exports = router;