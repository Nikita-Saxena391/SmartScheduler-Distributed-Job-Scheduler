import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import {
  FaFolder,
  FaPlus,
  FaTrash,
  FaClipboardList,
} from "react-icons/fa";
function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const projectsPerPage = 5;
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    }
  };
  

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async () => {
    try {
      await API.post("/projects", {
        name,
        description,
      });

      setName("");
      setDescription("");

     await fetchProjects();
setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
    await fetchProjects();

if (
  currentPage > 1 &&
  (projects.length - 1) <= (currentPage - 1) * projectsPerPage
) {
  setCurrentPage(currentPage - 1);
}
    } catch (err) {
      console.error(err);
    }
  };
// Pagination
const indexOfLastProject = currentPage * projectsPerPage;
const indexOfFirstProject = indexOfLastProject - projectsPerPage;

const currentProjects = projects.slice(
  indexOfFirstProject,
  indexOfLastProject
);

const totalPages = Math.ceil(
  projects.length / projectsPerPage
);
  return (
   
    <div className="flex">
  <Sidebar />

  <div className="flex-1 p-8 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="flex items-center justify-between mb-8">
     <div>
  <div className="flex items-center gap-3">
    <div className="bg-blue-600 p-3 rounded-xl shadow">
      <FaFolder className="text-white text-2xl" />
    </div>

    <h1 className="text-4xl font-bold text-gray-800">
      Projects
    </h1>
  </div>

  <p className="text-gray-500 mt-2">
    Manage all projects in SmartScheduler
  </p>
</div>

      <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow">
        <div className="flex items-center gap-3">
          <FaClipboardList className="text-2xl" />
          <div>
            <p className="text-sm">Total Projects</p>
            <h2 className="text-2xl font-bold">
              {projects.length}
            </h2>
          </div>
        </div>
      </div>
    </div>

    {/* Create Project */}
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FaPlus className="text-blue-600" />
        Create New Project
      </h2>

      <div className="space-y-4">

        <input
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full border rounded-lg p-3 h-28 resize-none outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={createProject}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-semibold"
        >
          + Create Project
        </button>

      </div>

    </div>

    {/* Projects Table */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">
          Project List
        </h2>
      </div>

      <table className="w-full">

        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4">Project</th>
            <th className="text-left p-4">Description</th>
            <th className="text-center p-4">Actions</th>
          </tr>
        </thead>

        <tbody>

          {projects.length === 0 ? (
            <tr>
              <td
                colSpan="3"
                className="text-center py-10 text-gray-500"
              >
                <FaFolder className="text-5xl mx-auto mb-3 text-gray-300" />
                No Projects Found
              </td>
            </tr>
          ) : (
            currentProjects.map((project) =>  (
              <tr
                key={project._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4">

                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaFolder className="text-blue-600" />
                    </div>

                    <span className="font-semibold">
                      {project.name}
                    </span>
                  </div>

                </td>

                <td className="p-4 text-gray-600">
                  {project.description}
                </td>

                <td className="p-4 text-center">

                  <button
                    onClick={() => deleteProject(project._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition"
                  >
                    <FaTrash />
                  </button>

                </td>
              </tr>
            ))
          )}

        </tbody>

      </table>
      {projects.length > 0 && (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 border-t bg-gray-50">

    <p className="text-sm text-gray-600">
      Showing{" "}
      <span className="font-semibold">
        {indexOfFirstProject + 1}
      </span>
      {" - "}
      <span className="font-semibold">
        {Math.min(indexOfLastProject, projects.length)}
      </span>
      {" of "}
      <span className="font-semibold">
        {projects.length}
      </span>{" "}
      projects
    </p>

    <div className="flex items-center gap-2">

      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className={`px-4 py-2 rounded-lg transition ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
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
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 hover:bg-blue-50"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className={`px-4 py-2 rounded-lg transition ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
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

export default Projects;