import React, { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { CloudCog, X } from "lucide-react";
import axios from "axios";

const CreateUserModal = ({ onClose, onSave }) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!userData.email || !userData.password || !userData.role) {
        setError("Email, password and role are required.");
        return;
      }

      // Fix email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        setError("Please enter a valid email address.");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token");

      // Format the request data to match API expectations
      const requestData = {
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName || "",
        username: userData.email, // Add username field, using email as username
        role: userData.role,
        subscriptionId: null // Add subscriptionId field if needed
      };

      console.log("Sending request with data:", requestData); // Debug log

      const response = await axios.post(
        `${import.meta.env.VITE_API}/UserProfile/create`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log("Response:", response.data); // Debug log
      onSave(response.data);
      onClose();
      
    } catch (err) {
      console.error("Full error:", err); // Add full error logging
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to create user";
      setError(Array.isArray(errorMessage) ? errorMessage.join("\n") : errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add useEffect to handle error auto-dismiss
  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError(null);
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timer); // Cleanup timer
  }, [error]); // Run effect when error changes

  // Modify your error display with animation
  const errorDisplay = error && (
    <motion.div
      className="mb-4 p-2 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {error}
    </motion.div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 pt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 text-gray-100 rounded-xl p-6 w-[400px] shadow-2xl border border-gray-700 relative mb-24"
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 30, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={22} />
          </button>

          <h2 className="text-xl font-semibold mb-5 text-white">Create User</h2>

          <AnimatePresence>{errorDisplay}</AnimatePresence>

          <label className="block text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a role</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>

          <label className="block text-gray-300 mt-4 mb-1">
            Subscription Status
          </label>
          <div className="w-full p-2 rounded bg-gray-700 text-gray-400 border border-gray-600">
            None
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`mt-6 w-full p-2 rounded text-white font-semibold transition-all duration-200 ${
              isSubmitting
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateUserModal;
