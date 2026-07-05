const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// Create Project
router.post("/", protect, createProject);

// Get Projects
router.get("/", protect, getProjects);

// Update Project
router.put("/:id", protect, updateProject);

// Delete Project
router.delete("/:id", protect, deleteProject);

module.exports = router;