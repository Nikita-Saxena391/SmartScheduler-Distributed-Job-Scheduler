const Queue = require("../models/Queue");
const Project = require("../models/Project");

// Create Queue
const createQueue = async (req, res) => {
  try {
    const {
      projectId,
      name,
      priority,
      concurrency,
      retryStrategy,
      retryAttempts,
      retryDelay,
    } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const queue = await Queue.create({
      project: projectId,
      name,
      priority,
      concurrency,
      retryStrategy,
      retryAttempts,
      retryDelay,
    });

    res.status(201).json({
      success: true,
      message: "Queue created successfully",
      queue,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Queues
const getQueues = async (req, res) => {
  try {
    console.log("GET /api/queues called");

    const queues = await Queue.find().populate("project", "name");

    console.log("Queues:", queues);

    res.status(200).json({
      success: true,
      count: queues.length,
      queues,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
    
const pauseQueue = async (req, res) => {
  try {

    const queue = await Queue.findByIdAndUpdate(
      req.params.id,
      { status: "paused" },
      { new: true }
    );

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    res.json({
      success: true,
      message: "Queue paused successfully",
      queue,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};
const resumeQueue = async (req, res) => {
  try {

    const queue = await Queue.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    res.json({
      success: true,
      message: "Queue resumed successfully",
      queue,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};
module.exports = {
  createQueue,
  getQueues,
    pauseQueue,
    resumeQueue,
};