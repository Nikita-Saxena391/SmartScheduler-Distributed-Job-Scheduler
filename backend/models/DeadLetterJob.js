const mongoose = require("mongoose");

const dlqSchema = new mongoose.Schema({
  originalJob: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  reason: String,
  failedAt: Date,
});

module.exports = mongoose.model("DeadLetterJob", dlqSchema);