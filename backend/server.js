const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const role = require("./middleware/roleMiddleware");


const projectRoutes = require("./routes/projectRoutes");
const jobRoutes = require("./routes/jobRoutes");
const queueRoutes = require("./routes/queueRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const workerRoutes = require("./routes/workerRoutes");
const cronRoutes = require("./routes/cronRoutes");
const authRoutes = require("./routes/authRoutes");

const connectDB = require("./config/db");
const startCronScheduler = require("./services/cronScheduler");

// ✅ Import worker processing function
const processJobs = require("./services/workerService");
const Worker = require("./models/Worker");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("⚡ Client Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected:", socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/queues", queueRoutes);
console.log("Queue routes registered");
app.use("/api/jobs", jobRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/cron", cronRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Distributed Job Scheduler API Running",
  });
});

// --------------------
// Start Cron Scheduler
// --------------------
startCronScheduler();

// --------------------
// Start Worker
// --------------------
async function startWorker() {
  try {
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

    console.log(`✅ Worker Started: ${worker.name}`);

    // Heartbeat every 5 sec
    setInterval(async () => {
      try {
        await Worker.findByIdAndUpdate(worker._id, {
          heartbeat: new Date(),
          status: "online",
        });
      } catch (err) {
        console.error("Heartbeat Error:", err);
      }
    }, 5000);

    // Poll queue every 3 sec
    setInterval(async () => {
      try {
        await processJobs(worker._id);
      } catch (err) {
        console.error("Process Job Error:", err);
      }
    }, 3000);

  } catch (err) {
    console.error("Worker Startup Error:", err);
  }
}

startWorker();

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});