const processJobs = require("./processJobs");
const Worker = require("../models/Worker");

module.exports = async function startWorker() {
  const worker = await Worker.findOneAndUpdate(
    { name: "Worker-1" },
    {
      name: "Worker-1",
      status: "online",
      heartbeat: new Date(),
    },
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  setInterval(() => {
    processJobs(worker._id);
  }, 3000);
};