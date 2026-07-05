const Job = require("../models/Job");
const Worker = require("../models/Worker");

const getWorkers = async (req, res) => {
  try {
    const jobs = await Job.find();
    const workers = await Worker.find();

    const completed = jobs.filter(j => j.status === "completed").length;
    const running = jobs.filter(j => j.status === "running").length;
    const queued = jobs.filter(j => j.status === "queued").length;

    const enrichedWorkers = workers.map(worker => {
      const workerId = worker._id.toString();

      const runningJob = jobs.find(
        j =>
          j.worker &&
          j.worker.toString() === workerId &&
          j.status === "running"
      );

      return {
        id: worker._id,
        name: worker.name,
        status: worker.status,
        currentJob: runningJob ? runningJob.title : "Idle",
        jobsProcessed: worker.jobsProcessed || 0,
      };
    });

    console.log("Workers from DB:", workers);
    console.log("Enriched Workers:", enrichedWorkers);

    res.json({
      success: true,
      summary: {
        totalJobs: jobs.length,
        completed,
        running,
        queued,
      },
      workers: enrichedWorkers,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getWorkers,
};