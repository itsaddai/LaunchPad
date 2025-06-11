import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeGenerator from "./pages/ResumeCreation";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./pages/Navbar"; // Make sure Navbar is in components or adjust the path accordingly

// Protect routes that need authentication
function PrivateRoute({ children }) {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <h1>Access Denied: Please Login</h1>;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/resume"
            element={
              <PrivateRoute>
                <ResumeGenerator />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
