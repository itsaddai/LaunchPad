import React from 'react';
import LandingPage from "./pages/Landing";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Navbar from "./pages/Navbar"

function PrivateRoute({ children }) {
  const { user, token } = useAuth();

  // Optional: log for debugging
  console.log("PrivateRoute check:", { user, token });

  if (!user || !token) {
    return <h1>Access Denied: Please Login</h1>; // or <Navigate to="/login" replace />
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
           <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/*  Navbar */}
          <Route path="/" element={<Navbar />} />

          {/*  dashboard protected */}
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
