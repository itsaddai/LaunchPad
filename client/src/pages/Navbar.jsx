import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <Link to="/" className="text-xl font-bold">🚀 LaunchPad</Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-700 hover:text-black">Home</Link>

        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-black">Dashboard</Link>
            <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
            <span className="text-sm text-gray-600">Hi, {user.name}</span>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-black">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-black">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
