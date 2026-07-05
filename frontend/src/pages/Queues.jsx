import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import {
  FaTasks,
  FaPlus,
  FaLayerGroup,
} from "react-icons/fa";

function Queues() {
  const [queues, setQueues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const queuesPerPage = 5;

  const [form, setForm] = useState({
    name: "",
    project: "",
    priority: 1,
    concurrency: 1,
    retryStrategy: "fixed",
  });

  const fetchQueues = async () => {
  try {
    const res = await API.get("/queues");

    console.log("Response:", res);
    console.log("Data:", res.data);
    console.log("Queues:", res.data.queues);

    setQueues(res.data.queues || []);
  } catch (err) {
    console.log(err.response);
    console.log(err.response?.data);
  }
};

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueues();
    fetchProjects();
  }, []);

  const createQueue = async () => {
    try {
      await API.post("/queues", {
        projectId: form.project,
        name: form.name,
        priority: Number(form.priority),
        concurrency: Number(form.concurrency),
        retryStrategy: form.retryStrategy,
      });

      setForm({
        name: "",
        project: "",
        priority: 1,
        concurrency: 1,
        retryStrategy: "fixed",
      });

      await fetchQueues();
setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
  };
// Pagination
const indexOfLastQueue = currentPage * queuesPerPage;
const indexOfFirstQueue = indexOfLastQueue - queuesPerPage;

const currentQueues = queues.slice(
  indexOfFirstQueue,
  indexOfLastQueue
);

const totalPages = Math.ceil(
  queues.length / queuesPerPage
);
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-3 rounded-xl shadow">
                <FaTasks className="text-white text-2xl" />
              </div>

              <h1 className="text-4xl font-bold text-gray-800">
                Queue Management
              </h1>
            </div>

            <p className="text-gray-500 mt-2">
              Manage job queues in SmartScheduler
            </p>
          </div>

          <div className="bg-indigo-600 text-white px-6 py-4 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <FaLayerGroup className="text-2xl" />

              <div>
                <p className="text-sm">Total Queues</p>
                <h2 className="text-2xl font-bold">
                  {queues.length}
                </h2>
              </div>
            </div>
          </div>

        </div>

        {/* Create Queue */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FaPlus className="text-indigo-600" />
            Create New Queue
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <input
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Queue Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <select
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.project}
              onChange={(e) =>
                setForm({ ...form, project: e.target.value })
              }
            >
              <option value="">Select Project</option>

              {projects.map((project) => (
                <option
                  key={project._id}
                  value={project._id}
                >
                  {project.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Priority"
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Concurrency"
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.concurrency}
              onChange={(e) =>
                setForm({
                  ...form,
                  concurrency: e.target.value,
                })
              }
            />

            <select
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.retryStrategy}
              onChange={(e) =>
                setForm({
                  ...form,
                  retryStrategy: e.target.value,
                })
              }
            >
              <option value="fixed">
                Fixed Retry
              </option>

              <option value="exponential">
                Exponential Retry
              </option>
            </select>

          </div>

          <button
            onClick={createQueue}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-3 rounded-lg font-semibold"
          >
            + Create Queue
          </button>

        </div>

        {/* Queue List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">
              Queue List
            </h2>
          </div>

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>
                <th className="text-left p-4">Queue</th>
                <th className="text-left p-4">Project</th>
                <th className="text-center p-4">Priority</th>
                <th className="text-center p-4">Concurrency</th>
                <th className="text-center p-4">Retry Strategy</th>
              </tr>

            </thead>

            <tbody>

              {queues.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-500"
                  >
                    <FaTasks className="text-5xl mx-auto mb-3 text-gray-300" />
                    No Queues Available
                  </td>

                </tr>

              ) : (

              currentQueues.map((queue)  => (

                  <tr
                    key={queue._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <div className="bg-indigo-100 p-3 rounded-full">
                          <FaTasks className="text-indigo-600" />
                        </div>

                        <span className="font-semibold">
                          {queue.name}
                        </span>

                      </div>

                    </td>

                    <td className="p-4">
                      {queue.project?.name}
                    </td>

                    <td className="text-center p-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {queue.priority}
                      </span>
                    </td>

                    <td className="text-center p-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {queue.concurrency}
                      </span>
                    </td>

                    <td className="text-center p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          queue.retryStrategy === "fixed"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {queue.retryStrategy}
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>
          {queues.length > 0 && (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 border-t bg-gray-50">

    <p className="text-sm text-gray-600">
      Showing{" "}
      <span className="font-semibold">
        {indexOfFirstQueue + 1}
      </span>
      {" - "}
      <span className="font-semibold">
        {Math.min(indexOfLastQueue, queues.length)}
      </span>
      {" of "}
      <span className="font-semibold">
        {queues.length}
      </span>{" "}
      queues
    </p>

    <div className="flex items-center gap-2">

      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`w-10 h-10 rounded-lg font-semibold transition ${
            currentPage === index + 1
              ? "bg-indigo-600 text-white"
              : "bg-white border border-gray-300 hover:bg-indigo-50"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        Next
      </button>

    </div>

  </div>
)}

        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-gray-500 border-t pt-6">
          <p className="font-semibold">
            ❤️ Built with Love by Nikita Saxena
          </p>

          <p className="text-sm">
            RA2311008020011 | SmartScheduler
          </p>
        </footer>

      </div>
    </div>
  );
}

export default Queues;