// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Applications";
import CoverLetterGeneration from "./pages/CoverLetterGeneration";
import Profile from "./pages/Profile";
import Navbar from "./pages/Navbar";
import { AuthProvider, useAuth }   from "./context/AuthContext";
import { ProfileProvider }         from "./context/ProfileContext";
//import navigate
import { Navigate } from "react-router-dom";




// Protect routes that need authentication
function PrivateRoute({ children }) {
  const { user, token } = useAuth();
  if (!user || !token) return <Navigate to ="/login" replace/>;
  return children;
}


export default function App() {

  /* APP UI */
  return (
    <AuthProvider>
      <ProfileProvider>
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
                    <CoverLetterGeneration />
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

          </Router>
        </div>
      </ProfileProvider>
    </AuthProvider>
  );
}
