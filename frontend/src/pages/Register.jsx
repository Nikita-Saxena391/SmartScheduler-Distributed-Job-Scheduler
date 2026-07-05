import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";

function Register() {
  const [form, setForm] = useState({
    name: "",
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
      const res = await API.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);

      toast.success("Registration Successful!");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <>
      <Toaster />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-96"
        >
          {/*  Logo Section */}
          <div className="flex flex-col items-center mb-6">
            <FaUserCircle className="text-green-600 text-6xl mb-2" />
            <h1 className="text-3xl font-bold text-center">
              Register
            </h1>
            <p className="text-gray-500 text-sm">
              Create your account
            </p>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full border p-3 rounded mb-4"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-3 rounded mb-4"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-3 rounded mb-6"
            onChange={handleChange}
          />

          <button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
            Register
          </button>

          <p className="text-center mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;