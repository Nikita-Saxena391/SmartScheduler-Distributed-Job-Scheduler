const startWorker = require("./services/workers/startWorker");
const monitorWorkers = require("./services/workers/monitorWorkers");

async function run() {
  console.log("Starting worker system...");

  monitorWorkers(); // ✅ must start heartbeat checker
  await startWorker(); // worker loop
}

run();