const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    priority: {
      type: Number,
      default: 1,
    },

    concurrency: {
      type: Number,
      default: 1,
    },

    retryStrategy: {
      type: String,
      enum: ["fixed", "linear", "exponential"],
      default: "fixed",
    },

    retryAttempts: {
      type: Number,
      default: 3,
    },

    retryDelay: {
      type: Number,
      default: 5000,
    },

   status: {
    type: String,
    enum: ["active", "paused"],
    default: "active",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Queue", queueSchema);