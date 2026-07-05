import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import {
  FaBriefcase,
  FaPlus,
  FaTasks,
  FaListAlt,
} from "react-icons/fa";
function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [queues, setQueues] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    queueId: "",
    title: "",
    priority: 1,
  });

  const fetchJobs = async (pageNumber = 1) => {
    try {
      const res = await API.get(
        `/jobs?page=${pageNumber}&limit=${limit}`
      );

      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQueues = async () => {
    try {
      const res = await API.get("/queues");
      setQueues(res.data.queues);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs(1);
    fetchQueues();
  }, []);

  const createJob = async () => {
    try {
      await API.post("/jobs", {
        queueId: form.queueId,
        title: form.title,
        priority: form.priority,
      });

      setForm({
        queueId: "",
        title: "",
        priority: 1,
      });

      fetchJobs(page); // stay on same page
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-8">

  <div>
    <div className="flex items-center gap-3">
      <div className="bg-green-600 p-3 rounded-xl shadow">
        <FaBriefcase className="text-white text-2xl" />
      </div>

      <h1 className="text-4xl font-bold text-gray-800">
        Jobs
      </h1>
    </div>

    <p className="text-gray-500 mt-2">
      Manage and monitor scheduled jobs
    </p>
  </div>

  <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow">
    <div className="flex items-center gap-3">
      <FaTasks className="text-2xl" />

      <div>
        <p className="text-sm">Total Jobs</p>
        <h2 className="text-2xl font-bold">
          {jobs.length}
        </h2>
      </div>
    </div>
  </div>

</div>

        {/* FORM */}
      
         
         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
    <FaPlus className="text-green-600" />
    Create New Job
  </h2>

  <div className="grid md:grid-cols-3 gap-4">

    <select
      className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
      value={form.queueId}
      onChange={(e) =>
        setForm({ ...form, queueId: e.target.value })
      }
    >
      <option value="">Select Queue</option>

      {queues.map((queue) => (
        <option key={queue._id} value={queue._id}>
          {queue.name}
        </option>
      ))}
    </select>

    <input
      className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
      placeholder="Job Title"
      value={form.title}
      onChange={(e) =>
        setForm({
          ...form,
          title: e.target.value,
        })
      }
    />

    <input
      type="number"
      className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
      placeholder="Priority"
      value={form.priority}
      onChange={(e) =>
        setForm({
          ...form,
          priority: Number(e.target.value),
        })
      }
    />

  </div>

  <button
    onClick={createJob}
    className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
  >
    + Create Job
  </button>

</div>

        {/* TABLE */}
       
             
                    
                     <div className="bg-white rounded-xl shadow-lg overflow-hidden">

  <div className="px-6 py-4 border-b">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <FaListAlt className="text-green-600" />
      Job List
    </h2>
  </div>

  <table className="w-full">

    <thead className="bg-gray-50">

      <tr>
        <th className="text-left p-4">Queue</th>
        <th className="text-left p-4">Title</th>
        <th className="text-center p-4">Status</th>
        <th className="text-center p-4">Priority</th>
      </tr>

    </thead>

    <tbody>

      {jobs.length === 0 ? (

        <tr>

          <td
            colSpan="4"
            className="text-center py-10 text-gray-500"
          >
            <FaBriefcase className="text-5xl mx-auto mb-3 text-gray-300" />

            No Jobs Found
          </td>

        </tr>

      ) : (

        jobs.map((job) => (

          <tr
            key={job._id}
            className="border-t hover:bg-gray-50 transition"
          >

            <td className="p-4">
              {job.queue?.name || "N/A"}
            </td>

            <td className="p-4 font-medium">
              {job.title}
            </td>

            <td className="text-center p-4">

              <span
                className={`px-3 py-1 rounded-full text-white text-sm ${
                  job.status === "completed"
                    ? "bg-green-500"
                    : job.status === "running"
                    ? "bg-yellow-500"
                    : job.status === "failed"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                {job.status}
              </span>

            </td>

            <td className="text-center p-4">

              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {job.priority}
              </span>

            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>

        {/* PAGINATION */}
       
          <div className="flex justify-center items-center gap-4 mt-8">

  <button
    disabled={page === 1}
    onClick={() => fetchJobs(page - 1)}
    className="px-5 py-2 bg-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-400"
  >
    ← Previous
  </button>

  <span className="font-semibold text-gray-700">
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => fetchJobs(page + 1)}
    className="px-5 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700"
  >
    Next →
  </button>

</div>
{/* Footer */}
<footer className="mt-10 bg-gray-900 text-white rounded-xl shadow-lg">
  <div className="py-8 text-center">
    <p className="font-semibold text-lg">
      ❤️ Built with Love by Nikita Saxena
    </p>

    <p className="text-gray-300 mt-2">
      RA2311008020011 | SmartScheduler
    </p>

    <div className="mt-3 border-t border-gray-700 pt-3 text-sm text-gray-400">
      © {new Date().getFullYear()} SmartScheduler. All Rights Reserved.
    </div>
  </div>
</footer>
      </div>
      
    </div>
  );
           

}

export default Jobs;