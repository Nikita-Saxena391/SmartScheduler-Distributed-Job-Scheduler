import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function Workers() {
  const [summary, setSummary] = useState({
    totalJobs: 0,
    completed: 0,
    running: 0,
    queued: 0,
  });

  const [workers, setWorkers] = useState([]);

 
     useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await API.get("/workers");
        setSummary(res.data.summary);
        setWorkers(res.data.workers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWorkers();

    const interval = setInterval(() => {
      fetchWorkers();
    }, 3000);
   return () => clearInterval(interval);
  }, []);// initial load

  

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">
          Worker Monitoring
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h2>Total Jobs</h2>
            <p className="text-3xl font-bold">{summary.totalJobs}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2>Completed</h2>
            <p className="text-3xl font-bold text-green-600">
              {summary.completed}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2>Running</h2>
            <p className="text-3xl font-bold text-yellow-600">
              {summary.running}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2>Queued</h2>
            <p className="text-3xl font-bold text-blue-600">
              {summary.queued}
            </p>
          </div>
        </div>

        {/* Worker Table */}
        <div className="bg-white rounded shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Worker</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Current Job</th>
                <th className="p-4 text-left">Jobs Processed</th>
              </tr>
            </thead>

            <tbody>
             
     {workers.map((worker) => (
  <tr key={worker.id} className="border-t">
    <td className="p-4">{worker.name}</td>

    <td className="p-4">
      <span
        className={`px-3 py-1 rounded text-white ${
          worker.status === "online"
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      >
        {worker.status}
      </span>
    </td>

    <td className="p-4">
      
  <td className="p-4">
  {worker.currentJob}

</td>
    </td>

    <td className="p-4">
      {worker.jobsProcessed ?? 0}
    </td>
  </tr>

))}
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Workers;