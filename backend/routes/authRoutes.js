const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");

const {
  register,
  login,
  profile,
} = require("../controllers/authController");

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Route
router.get("/profile", protect, profile);

module.exports = router;