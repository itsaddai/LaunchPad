import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long and include one uppercase letter and one number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Show success toast
      toast.success("Account created successfully, please log in!");

      // Optional: Redirect after a delay to let user see toast
      setTimeout(() => {
        navigate("/profile");
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/${provider}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* ToastContainer renders the toasts */}
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />

      <h2 className="text-2xl font-semibold mb-6">Create Your LaunchPad Account</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={fullName}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-2 border rounded mt-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be 8+ characters, include 1 uppercase letter and 1 number.
          </p>
          <label className="text-sm flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show password
          </label>
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Register
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      <div className="w-full max-w-sm mt-4">
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-sm text-gray-500">or continue with</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <button
          onClick={() => handleOAuth("google")}
          className="w-full bg-white border border-gray-300 text-black py-2 rounded mb-2 hover:bg-gray-100">
          <FaGoogle className="inline mr-2 text-red-500" />
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth("github")}
          className="w-full bg-white border border-gray-300 text-black py-2 rounded hover:bg-gray-100">
          <FaGithub className="inline mr-2" />
          Continue with GitHub
        </button>
      </div>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
