import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Password must be 8+ chars, 1 uppercase, 1 number
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
      const res = await fetch("http://localhost:5000/api/auth/register", {
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

      // Success: account created but not logged in
      alert("Account created. Please check your email to verify your account.");
      navigate("/verify-email");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
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
            ></input>
          
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