// RedesignedLandingPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SankeyMChart from "../components/SankeyMChart";
import heroImage from "../components/productivity-improvement-strategies.png"; // You can download a relevant graphic or use a placeholder
import { Button } from "../components/ui/button";

const LandingPage = () => {
  const { user, token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) return;

    const fetchApps = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://launchpad-backend.onrender.com/api/applications/", {
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

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row items-center justify-between px-8 py-16 max-w-7xl mx-auto">
        <div className="max-w-xl text-left">
          <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900">
            Generate <span className="text-blue-600">Tailored</span> Cover Letters Instantly
          </h1>
          <p className="text-gray-700 mb-8 text-lg">
            Stop wasting time and start applying confidently with AI-powered cover letters that match job postings and highlight your unique strengths.
          </p>
          <div className="space-x-4">
            <Link to="/register">
              <Button className="px-6 py-3 bg-blue-600 text-white text-lg hover:bg-blue-700">
                Create your first Cover Letter!
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="px-6 py-3 text-lg">
                Already have an account?
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 lg:mt-0">
          <img
            src={heroImage}
            alt="Cover Letter AI Generator"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Welcome back, {user.name || user.email}
      </h1>
      <p className="mb-6 text-gray-700">
        Here's a visual breakdown of your applications:
      </p>
      {loading && <p className="text-gray-500">Loading application data…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && <SankeyMChart applications={applications} />}
    </div>
  );
};

export default LandingPage;
