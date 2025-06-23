import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-gray-800">
        <Link to="/">LaunchPad</Link>
      </div>

      <div className="flex space-x-4 items-center">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:underline">
              Dashboard
            </Link>
            <Link to="/generate" className="text-gray-700 hover:underline">
              Resume Builder
            </Link>
            <Link to="/profile" className="text-gray-700 hover:underline">
              Profile
            </Link>
            <button
              onClick={logout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;