const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },

    heartbeat: {
      type: Date,
      default: Date.now,
    },

    currentJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
    jobsProcessed: {
  type: Number,
  default: 0,
},
  },
  
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Worker", workerSchema);