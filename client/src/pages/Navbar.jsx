import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-end items-center">
        <div className="flex gap-8 items-center text-sm font-medium text-gray-600">
          <Link
            to="/dashboard"
            className="hover:underline hover:text-gray-900 transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/resume-builder"
            className="hover:underline hover:text-gray-900 transition-colors duration-200"
          >
            Resume Builder
          </Link>
          {user ? (
            <button
              onClick={logout}
              className="hover:underline hover:text-gray-900 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:underline hover:text-gray-900 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:underline hover:text-gray-900 transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
