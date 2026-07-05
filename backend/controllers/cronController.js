const CronJob = require("../models/CronJob");

// Create Cron Job
const createCronJob = async (req, res) => {
  try {
    const {
      queueId,
      title,
      payload,
      priority,
      cronExpression,
    } = req.body;

    const cronJob = await CronJob.create({
      queue: queueId,
      title,
      payload,
      priority,
      cronExpression,
    });

    res.status(201).json({
      success: true,
      message: "Cron Job Created",
      cronJob,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Cron Jobs
const getCronJobs = async (req, res) => {

  const jobs = await CronJob.find().populate("queue","name");

  res.json({
    success:true,
    count:jobs.length,
    jobs
  });

};

module.exports = {
  createCronJob,
  getCronJobs,
};