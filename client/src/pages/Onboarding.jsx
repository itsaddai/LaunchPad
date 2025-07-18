/* import React, { useState, useEffect, useRef } from "react";
import Joyride from "react-joyride";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Onboarding = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
   
  });
  const [runTour, setRunTour] = useState(true);
  const navigate = useNavigate();

  const steps = [
    {
      target: ".profile-name-input",
      content: "Let's start by entering your full name. This helps us generate strong cover letters.",
    },
    {
      target: ".save-profile-btn",
      content: "Click here to save and continue to your dashboard!",
    },
  ];

  const handleSave = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ fullName: profile.fullName, onboardingComplete: true }),
    });

    const data = await res.json();
    updateUser(data.user);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Joyride
        steps={steps}
        run={runTour}
        showSkipButton
        continuous
        styles={{
          options: {
            primaryColor: "#000",
            zIndex: 1000,
          },
        }}
      />

      <h2 className="text-2xl font-bold mb-4">Finish Setting Up</h2>

      <input
        type="text"
        value={profile.fullName}
        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
        placeholder="Your Full Name"
        className="profile-name-input w-full max-w-sm p-2 border rounded mb-4"
      />

      <button
        onClick={handleSave}
        className="save-profile-btn bg-black text-white px-6 py-2 rounded"
      >
        Save and Continue
      </button>
    </div>
  );
};

export default Onboarding;
*/

// will work on this in the future