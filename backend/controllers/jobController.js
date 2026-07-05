const Job = require("../models/Job");
const Queue = require("../models/Queue");

// Create Job
const createJob = async (req, res) => {
  try {
    const {
      queueId,
      title,
      payload,
      priority,
      delay,
      scheduledAt,
    } = req.body;

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    let jobSchedule = new Date();

    if (scheduledAt) {
      jobSchedule = new Date(scheduledAt);
    } else if (delay && delay > 0) {
      jobSchedule = new Date(Date.now() + delay);
    }

    const job = await Job.create({
      queue: queueId,
      title,
      payload,
      priority: priority ?? 1,
      scheduledAt: jobSchedule,

      status: "queued",
      retryCount: 0,
      failedReason: null,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
  

// Get Jobs
const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // optional filters (very useful later)
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.queueId) {
      filter.queue = req.query.queueId;
    }

    const jobs = await Job.find(filter)
      .populate("queue", "name")
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      jobs,
      totalJobs: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Create Batch Jobs
const createBatchJobs = async (req, res) => {
  try {
    const jobs = req.body;

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of jobs",
      });
    }

    const formattedJobs = jobs.map(item => {
      let jobSchedule = new Date();

      if (item.scheduledAt) {
        jobSchedule = new Date(item.scheduledAt);
      } else if (item.delay && item.delay > 0) {
        jobSchedule = new Date(Date.now() + item.delay);
      }

      return {
        queue: item.queueId,
        title: item.title,
        payload: item.payload,
        priority: item.priority || 0,
        scheduledAt: jobSchedule,

        status: "queued",
        retryCount: 0,
        failedReason: null
      };
    });

    const createdJobs = await Job.insertMany(formattedJobs);

    return res.status(201).json({
      success: true,
      message: `${createdJobs.length} jobs created successfully`,
      jobs: createdJobs,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }

};
module.exports = {
  createJob,
  getJobs,
   createBatchJobs,
};