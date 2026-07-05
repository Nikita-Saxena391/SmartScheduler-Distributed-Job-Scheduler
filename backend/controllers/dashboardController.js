const Project = require("../models/Project");
const Queue = require("../models/Queue");
const Job = require("../models/Job");

const getDashboardStats = async (req, res) => {
  try {
    const projectCount = await Project.countDocuments({
      owner: req.user.id,
    });

    const queues = await Queue.find();

    const queueCount = queues.length;

    const jobs = await Job.find();

    const totalJobs = jobs.length;

    const completedJobs = jobs.filter(
      (job) => job.status === "completed"
    ).length;

    const queuedJobs = jobs.filter(
      (job) => job.status === "queued"
    ).length;

    const runningJobs = jobs.filter(
      (job) => job.status === "running"
    ).length;

    res.json({
      success: true,
      stats: {
        projectCount,
        queueCount,
        totalJobs,
        completedJobs,
        queuedJobs,
        runningJobs,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = { getDashboardStats };