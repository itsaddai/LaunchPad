import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";

const ResumeGenerator = () => {
  const { user, token } = useAuth();
  const { setFormData } = useProfile(); // Ensure this is inside a <ProfileProvider>

  const [jobURL, setJobURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/resume/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobURL,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      setResumeText(data.resume);

      let parsedResume;
      try {
        parsedResume =
          typeof data.resume === "string" ? JSON.parse(data.resume) : data.resume;
      } catch (err) {
        console.error("Failed to parse resume JSON:", err);
        parsedResume = {};
      }

      const cleanExperience = Object.entries(parsedResume?.Experience || {}).map(
        ([title, bullets]) => ({
          title,
          company: "",
          dateRange: "",
          bullets,
        })
      );

      const cleanProjects = Object.entries(parsedResume?.Projects || {}).map(
        ([title, bullets]) => ({
          title,
          description: Array.isArray(bullets) ? bullets.join(" ") : String(bullets),
          stack: "",
        })
      );

      setFormData((prev) => ({
        ...prev,
        title: parsedResume?.Title || prev.title,
        summary: parsedResume?.Summary || prev.summary,
        experience: cleanExperience,
        projects: cleanProjects,
      }));
    } catch (error) {
      console.error("Error generating resume:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">AI Resume Generator</h1>

      <input
        type="text"
        placeholder="Paste job posting URL or description"
        className="w-full p-3 border rounded mb-4"
        value={jobURL}
        onChange={(e) => setJobURL(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !jobURL}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        {loading ? "Generating..." : "Generate Resume"}
      </button>

      {resumeText && (
        <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
          <h2 className="text-lg font-semibold mb-2">Generated Resume:</h2>
          <pre>{resumeText}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeGenerator;
