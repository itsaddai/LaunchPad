import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CoverletterGeneration = () => {
  const { token } = useAuth();
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState("");
  const previewRef = useRef(null);

  const handleGenerate = async () => {
    if (!position || !company || !experience) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setCoverLetterText("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/generate`, {
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
  if (!coverLetterText) return;

  const element = document.createElement("div");
  element.style.width = "8.5in";
  element.style.minHeight = "11in";
  element.style.padding = "1in";
  element.style.backgroundColor = "#ffffff";
  element.style.color = "#000000";
  element.style.fontFamily = "Georgia, serif";
  element.style.fontSize = "12pt";
  element.style.lineHeight = "1.6";
  element.style.whiteSpace = "pre-wrap";
  element.innerText = coverLetterText;

  document.body.appendChild(element);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "letter");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Cover_Letter.pdf");
  } catch (error) {
    console.error("PDF generation failed:", error);
  } finally {
    document.body.removeChild(element);
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
              value={coverLetterText}
              onChange={(e) => setCoverLetterText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4"
            />
            <div
              ref={previewRef}
              className="bg-white text-black border border-gray-300 rounded-xl p-6 whitespace-pre-wrap font-serif leading-relaxed mb-6"
            >
              {coverLetterText}
            </div>
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
