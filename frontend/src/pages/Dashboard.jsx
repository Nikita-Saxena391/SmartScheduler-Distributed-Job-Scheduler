import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { io } from "socket.io-client";
import logo from "../assets/logo.jpeg"
import {
  FaFolder,
  FaTasks,
  FaCheckCircle,
  FaPlayCircle,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

function Dashboard() {
  const [stats, setStats] = useState({
    projectCount: 0,
    queueCount: 0,
    totalJobs: 0,
    completedJobs: 0,
    queuedJobs: 0,
    runningJobs: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await API.get("/dashboard");
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();

    const events = [
      "job:completed",
      "job:failed",
      "job:running",
      "job:created",
    ];

    events.forEach((event) => socket.on(event, fetchStats));

    return () => {
      events.forEach((event) => socket.off(event, fetchStats));
    };
  }, []);

  const jobStatusData = [
    { name: "Completed", value: stats.completedJobs },
    { name: "Running", value: stats.runningJobs },
    { name: "Queued", value: stats.queuedJobs },
  ].filter((item) => item.value > 0);

  return (
    

  
<div className="flex">
  <Sidebar />

  <div className="flex-1 p-10 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="flex items-center gap-4 mb-8">
      <img
        src={logo}
        alt="SmartScheduler Logo"
        className="w-14 h-14 rounded-xl shadow-md object-cover"
      />

      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          SmartScheduler
        </h1>
        <p className="text-gray-500 text-sm">
          Distributed Job Scheduling Platform
        </p>
      </div>
    </div>

    {/* Stats Cards */}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded shadow flex items-center gap-4">
            <FaFolder className="text-blue-500 text-3xl" />
            <div>
              <h2 className="text-gray-600">Projects</h2>
              <p className="text-3xl font-bold">{stats.projectCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow flex items-center gap-4">
            <FaTasks className="text-gray-700 text-3xl" />
            <div>
              <h2 className="text-gray-600">Queues</h2>
              <p className="text-3xl font-bold">{stats.queueCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow flex items-center gap-4">
            <FaPlayCircle className="text-blue-600 text-3xl" />
            <div>
              <h2 className="text-gray-600">Total Jobs</h2>
              <p className="text-3xl font-bold">{stats.totalJobs}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow flex items-center gap-4">
            <FaCheckCircle className="text-green-600 text-3xl" />
            <div>
              <h2 className="text-gray-600">Completed</h2>
              <p className="text-3xl font-bold">{stats.completedJobs}</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white mt-8 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">System Status</h2>

          <div className="space-y-3">
            <p>
              <FaFolder className="inline mr-2 text-blue-500" />
              Projects: {stats.projectCount}
            </p>

            <p>
              <FaTasks className="inline mr-2 text-gray-700" />
              Total Jobs: {stats.totalJobs}
            </p>

            <p>
              <FaCheckCircle className="inline mr-2 text-green-600" />
              Completed: {stats.completedJobs}
            </p>

            <p>
              <FaPlayCircle className="inline mr-2 text-blue-600" />
              Running: {stats.runningJobs}
            </p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white mt-8 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Job Distribution</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  label={false}
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [`${value} Jobs`, name]}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Footer */}
<footer className="mt-10 py-6 border-t border-gray-300 text-center text-gray-600">
  <p className="text-lg font-semibold">
    Built with <span className="text-red-500">❤️</span> by Nikita Saxena
  </p>
  <p className="text-sm mt-1">
    RA2311008020011 | SmartScheduler – Distributed Job Scheduling Platform
  </p>
</footer>
      </div>
      
    </div>
    
  );
}

export default Dashboard;
