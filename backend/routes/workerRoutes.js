const express = require("express");
const router = express.Router();

const { getWorkers } = require("../controllers/workerController");
const auth = require("../middleware/auth");
const role = require("../middleware/roleMiddleware");

router.get(
  "/",
  auth,
  role("admin"),
  getWorkers
);

module.exports = router;