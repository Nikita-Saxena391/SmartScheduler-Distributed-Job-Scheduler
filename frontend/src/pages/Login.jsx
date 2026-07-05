import { useState } from "react";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from "react-icons/fa";

import logo from "../assets/logo.jpeg";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] =useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      if (res.data.user?.role) {
        localStorage.setItem("role", res.data.user.role);
      }

      toast.success("Login Successful!");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center p-5">

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">

          {/* Header */}

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-4 px-6">

            <div className="flex justify-center">

              <img
                src={logo}
                alt="SmartScheduler"
                className="w-28 h-28 rounded-full border-4 border-white bg-white p-2 shadow-lg object-cover"
              />

            </div>

            <h1 className="text-3xl font-bold mt-2">
              SmartScheduler
            </h1>

            <p className="text-blue-100 text-sm mt-1">
              Distributed Job Scheduling Platform
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="p-8"
          >

            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Login
            </h2>

            {/* Email */}

            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>

              <div className="flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">

                <FaEnvelope className="text-gray-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-3 outline-none"
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Password */}

            <div className="mb-6">

              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>

              <div className="flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">

                <FaLock className="text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full p-3 outline-none"
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500 cursor-pointer" />
                  ) : (
                    <FaEye className="text-gray-500 cursor-pointer" />
                  )}
                </button>

              </div>

            </div>

            {/* Login */}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <FaSignInAlt />
              Login
            </button>

            {/* Register */}

            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>

          </form>

          {/* Footer */}

          <div className="bg-slate-900 text-white text-center py-5">

            <p className="font-semibold">
              ❤️ Built with Love by Nikita Saxena
            </p>

            <p className="text-slate-300 text-sm mt-1">
              RA2311008020011 | SmartScheduler
            </p>

            <p className="text-slate-400 text-xs mt-2">
              © {new Date().getFullYear()} SmartScheduler. All Rights Reserved.
            </p>

          </div>

        </div>

      </div>
    </>
  );
}

export default Login;