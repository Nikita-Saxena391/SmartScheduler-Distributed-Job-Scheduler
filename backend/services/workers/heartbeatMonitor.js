const Worker = require("../models/Worker");

const monitorWorkers = () => {
  setInterval(async () => {
    try {
      const timeout = new Date(Date.now() - 15000);

      const offline = await Worker.updateMany(
        { heartbeat: { $lt: timeout } },
        { status: "offline" }
      );

      const online = await Worker.updateMany(
        { heartbeat: { $gte: timeout } },
        { status: "online" }
      );

      console.log(
        `Monitor: offline=${offline.modifiedCount}, online=${online.modifiedCount}`
      );
    } catch (err) {
      console.error("Monitor error:", err);
    }
  }, 5000);
};

module.exports = monitorWorkers;