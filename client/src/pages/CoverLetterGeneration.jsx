import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
/* global html2pdf */

const CoverletterGeneration = () => {
  const { token } = useAuth();
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState("");
  const coverLetterRef = useRef(null);

  const handleGenerate = async () => {
    if (!position || !company || !experience) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setCoverLetterText("");

    try {
      const response = await fetch("https://launchpad-backend.onrender.com/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobTitle: position,
          companyName: company,
          jobDescription: jobDesc,
          userExperience: experience,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCoverLetterText(data.coverLetterText);
      } else {
        alert("Cover letter generation failed.");
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleDownload = async () => {
  try {
    const element = document.createElement("div");
    element.style.display = "none";
    element.style.color = "#000";
    element.style.backgroundColor = "#fff";
    element.style.fontFamily = "Arial, sans-serif";
    element.style.padding = "20px";
    element.innerHTML = coverLetterText.replace(/\n/g, "<br/>");
    document.body.appendChild(element);

    // Wrap in timeout to prevent UI lock
    setTimeout(() => {
      html2pdf()
        .set({
          margin: 1,
          filename: "Cover_Letter.pdf",
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(element)
        .save()
        .then(() => {
          document.body.removeChild(element);
        })
        .catch((error) => {
          console.error("PDF download error:", error);
        });
    }, 100); // slight delay lets React finish updating
  } catch (error) {
    console.error("Download failed:", error);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">AI-Powered Cover Letter Generator</h1>

        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Position Title *"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl"
        />

        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company Name *"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl"
        />

        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste Job Description (optional)"
          rows={4}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl"
        />

        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Describe your experience *"
          rows={6}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-xl"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>

        {coverLetterText && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">Edit Your Cover Letter</h2>
            <textarea
              ref={coverLetterRef}
              value={coverLetterText}
              onChange={(e) => setCoverLetterText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4"
            />
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Download as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverletterGeneration;
