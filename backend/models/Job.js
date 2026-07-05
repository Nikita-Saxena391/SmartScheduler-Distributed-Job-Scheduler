const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    queue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    status: {
      type: String,
      enum: [
        "queued",
        "scheduled",
        "claimed",
        "running",
        "completed",
        "failed",
        "dead",
      ],
      default: "queued",
    },

    priority: {
      type: Number,
      default: 1,
    },

    scheduledAt: {
      type: Date,
      default: Date.now,
    },

    retryCount: {
      type: Number,
      default: 0,
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    failedReason: {
      type: String,
      default: null,
    },

    nextRetryAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ INDEXES (ADD HERE)
jobSchema.index({ status: 1, scheduledAt: 1 });
jobSchema.index({ queue: 1, createdAt: -1 });
jobSchema.index({ priority: -1, createdAt: -1 });

// export model AFTER indexes
module.exports = mongoose.model("Job", jobSchema);