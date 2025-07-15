import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("Invalid verification link.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setStatus("Email verified! You can now log in.");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setStatus(`Verification failed: ${err.message}`);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{status}</h1>
        {status === "Email verified! You can now log in." && <p>Redirecting...</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
