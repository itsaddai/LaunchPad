import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGoogle, FaGithub } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, token: authToken } = useAuth(); 

 
  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {

      return null;
    }
  }

  useEffect(() => {
    // if logged in, redirect to dashboard
    if (authToken) {
      navigate("/", { replace: true });
      return;
    }

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      const user = parseJwt(token);
      login(token, user);
      navigate("/", { replace: true });
    }
  }, [location, authToken, login, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      login(data.token, data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Something went wrong. Try again.");
      console.error("Login error:", err);
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/${provider}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-semibold mb-6">Login to LaunchPad</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Login
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      <div className="mt-6 w-full max-w-sm space-y-2">
        <button
          onClick={() => handleOAuthLogin("google")}
          className="w-full flex items-center justify-center gap-2 bg-white border py-2 rounded hover:bg-gray-100"
        >
          <FaGoogle className="text-red-500" />
          Continue with Google
        </button>

        <button
          onClick={() => handleOAuthLogin("github")}
          className="w-full flex items-center justify-center gap-2 bg-white border py-2 rounded hover:bg-gray-100"
        >
          <FaGithub className="text-gray-800" />
          Continue with GitHub
        </button>
      </div>

      <p className="mt-4 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
