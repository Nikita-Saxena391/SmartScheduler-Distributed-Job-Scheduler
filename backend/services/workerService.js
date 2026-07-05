const Job = require("../models/Job");
const Worker = require("../models/Worker");
const DeadLetter = require("../models/DeadLetterJob");

const processJobs = async (workerId) => {
  try {
    console.log("Worker Polling...");

    // Pick the highest-priority available job
    const job = await Job.findOneAndUpdate(
      {
        status: { $in: ["queued", "scheduled"] },
        scheduledAt: { $lte: new Date() },
      },
      {
        $set: {
          status: "running",
          worker: workerId,
        },
      },
      {
        sort: {
          priority: -1,
          createdAt: 1,
        },
        returnDocument: "after",
      }
    ).populate("queue");

    if (!job) {
      console.log("No queued jobs found.");
      return;
    }

    console.log("Processing Job:", job.title);

    // Mark worker as busy
    await Worker.findByIdAndUpdate(workerId, {
      $set: {
        heartbeat: new Date(),
        status: "online",
        currentJob: job._id,
      },
    });

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      let success = true;

      if (job.title.includes("Email")) {
        success = Math.random() > 0.2;
      }

      if (job.title.includes("Critical")) {
        success = Math.random() > 0.9;
      }

      if (!success) {
        throw new Error("Random Worker Failure");
      }

      // Mark job completed
      job.status = "completed";
      job.completedAt = new Date();
      await job.save();

      // Update worker stats
      await Worker.findByIdAndUpdate(workerId, {
        $set: {
          heartbeat: new Date(),
          status: "online",
          currentJob: null,
        },
        $inc: {
          jobsProcessed: 1,
        },
      });

      console.log("Completed:", job.title);

    } catch (error) {
      job.retryCount = (job.retryCount || 0) + 1;

      if (job.retryCount <= job.queue.retryAttempts) {
        let delay = job.queue.retryDelay;

        switch (job.queue.retryStrategy) {
          case "linear":
            delay = job.queue.retryDelay * job.retryCount;
            break;

          case "exponential":
            delay =
              job.queue.retryDelay *
              Math.pow(2, job.retryCount - 1);
            break;

          case "fixed":
          default:
            delay = job.queue.retryDelay;
            break;
        }

        job.status = "queued";
        job.failedReason = error.message;
        job.nextRetryAt = new Date(Date.now() + delay);
        job.scheduledAt = job.nextRetryAt;

        await job.save();

        // Worker becomes idle after failure
        await Worker.findByIdAndUpdate(workerId, {
          $set: {
            heartbeat: new Date(),
            status: "online",
            currentJob: null,
          },
        });

        console.log(
          `Retry ${job.retryCount} scheduled after ${delay} ms`
        );
      } else {
        await DeadLetter.create({
          originalJob: job._id,
          reason: error.message,
          failedAt: new Date(),
        });

        job.status = "dead";
        job.failedReason = error.message;

        await job.save();

        // Worker becomes idle
        await Worker.findByIdAndUpdate(workerId, {
          $set: {
            heartbeat: new Date(),
            status: "online",
            currentJob: null,
          },
        });

        console.log("Retry limit exceeded → DEAD LETTER QUEUE");
      }
    }
  } catch (error) {
    console.error("Worker Error:", error);
  }
};

module.exports = processJobs;