import { Link } from "react-router-dom";
import {
  FiHome,
  FiFolder,
  FiList,
  FiBox,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";

import logo from "../assets/logo.jpeg";

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">

      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img
          src={logo}
          alt="Distributed Job Scheduler"
          className="h-16 object-contain"
        />
      </div>

      <nav className="space-y-4">

        <Link className="flex items-center gap-3 hover:text-blue-400" to="/dashboard">
          <FiHome /> Dashboard
        </Link>

        <Link className="flex items-center gap-3 hover:text-blue-400" to="/projects">
          <FiFolder /> Projects
        </Link>

        <Link className="flex items-center gap-3 hover:text-blue-400" to="/queues">
          <FiList /> Queues
        </Link>

        <Link className="flex items-center gap-3 hover:text-blue-400" to="/jobs">
          <FiBox /> Jobs
        </Link>

        <Link className="flex items-center gap-3 hover:text-blue-400" to="/workers">
          <FiUsers /> Workers
        </Link>

      </nav>

      <button
        onClick={logout}
        className="mt-10 flex items-center justify-center gap-2 bg-red-600 w-full py-2 rounded hover:bg-red-700"
      >
        <FiLogOut /> Logout
      </button>

    </div>
  );
}

export default Sidebar;