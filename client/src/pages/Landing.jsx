// ============================================================================
// 🚀 LandingPage.jsx — updated to wire the new ApplicationSankey component
// -----------------------------------------------------------------------------
// • Keeps the existing guest‑view (Login / Register).
// • Keeps the same useEffect fetch logic.
// • Fixes the import to point at our new ApplicationSankey component.
// • Passes `applications` straight through (array is already fetched).
// ============================================================================

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SankeyMChart from "../components/SankeyMChart"; // <- updated path

const LandingPage = () => {
  const { user, token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ───────────────── fetch once user & token exist ───────────────── */
  useEffect(() => {
    if (!user || !token) return;

    const fetchApps = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/applications", {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load application data", err);
        setError("Could not load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [user, token]);

  /* ───────────────────────────── UI ─────────────────────────────── */
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to LaunchPad 🚀</h1>
        <div className="space-x-4">
          <Link to="/login" className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">Login</Link>
          <Link to="/register" className="px-6 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">Register</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome back, {user.name || user.email}
      </h1>

      <p className="mb-6">Here’s a visual summary of your applications:</p>

      {loading && <p>Loading application data…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <SankeyMChart applications={applications} />
      )}
    </div>
  );
};

export default LandingPage;
// ============================================================================
