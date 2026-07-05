const cron = require("node-cron");

const CronJob = require("../models/CronJob");
const Job = require("../models/Job");

// Keep track of scheduled cron tasks
const scheduledTasks = new Map();

const startCronScheduler = async () => {
  console.log("🚀 Cron Scheduler Started");

  const cronJobs = await CronJob.find({
    status: "active",
  });

  cronJobs.forEach((cronJob) => {
    const id = cronJob._id.toString();

    // Don't schedule the same cron twice
    if (scheduledTasks.has(id)) {
      return;
    }

    const task = cron.schedule(cronJob.cronExpression, async () => {
      console.log(`Running Cron Job: ${cronJob.title}`);

      await Job.create({
        queue: cronJob.queue,
        title: cronJob.title,
        payload: cronJob.payload,
        priority: cronJob.priority,
        status: "queued",
        scheduledAt: new Date(),
      });

      console.log("New Job Created");
    });

    scheduledTasks.set(id, task);
  });
};

module.exports = startCronScheduler;