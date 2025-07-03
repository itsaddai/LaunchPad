// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage      from "./pages/Landing";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import Dashboard        from "./pages/Applications";
import ResumeGenerator  from "./pages/ResumeCreation";
import Profile          from "./pages/Profile";
import Navbar           from "./pages/Navbar";

import { AuthProvider, useAuth }   from "./context/AuthContext";
import { ProfileProvider }         from "./context/ProfileContext";


// ────────────────────────────────────────────────────────────────────────────
// A tiny toggle component (no separate file needed, but you can move it out)
const DarkModeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    className="fixed bottom-4 right-4 z-50 rounded-full p-3 text-xl
               bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
               transition-colors shadow"
    aria-label="Toggle dark mode"
  >
    {isDark ? "☀️" : "🌙"}
  </button>
);
// ────────────────────────────────────────────────────────────────────────────


// Protect routes that need authentication
function PrivateRoute({ children }) {
  const { user, token } = useAuth();
  if (!user || !token) return <h1 className="p-6">Access Denied: Please Login</h1>;
  return children;
}


export default function App() {
  /* ─────────────── theme state (persists in localStorage) ─────────────── */
  const [isDark, setIsDark] = useState(() =>
    window.localStorage.getItem("theme") === "dark"
  );

  // Add / remove the `dark` class on <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  /* ────────────────────────────── APP UI ─────────────────────────────── */
  return (
    <AuthProvider>
      <ProfileProvider>
        {/* The outer div gives every page a light & dark background / text */}
        <div className="min-h-screen bg-white text-gray-900
                        dark:bg-gray-900 dark:text-gray-100
                        transition-colors">
          <Router>
            <Navbar />

            <Routes>
              <Route path="/"            element={<LandingPage />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />

              <Route
                path="/generate"
                element={
                  <PrivateRoute>
                    <ResumeGenerator />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/applications"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<h1 className="p-6">404 Not Found</h1>} />
            </Routes>

            {/* floating theme toggle */}
            <DarkModeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
          </Router>
        </div>
      </ProfileProvider>
    </AuthProvider>
  );
}
