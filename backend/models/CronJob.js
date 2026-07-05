const mongoose = require("mongoose");

const cronJobSchema = new mongoose.Schema(
  {
    queue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    payload: {
      type: Object,
      default: {},
    },

    priority: {
      type: Number,
      default: 1,
    },

    cronExpression: {
      type: String,
      required: true,
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

module.exports = mongoose.model("CronJob", cronJobSchema);