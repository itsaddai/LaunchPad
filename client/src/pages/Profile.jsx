// ======================= Profile.jsx =======================
// Profile component for managing user profile information with date handling

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  months,
  years,
  monthStrToISO,
  isoToMonthStr,
  monthYearToISO,
  isoToMonthName,
  isoToYear,
} from "../utils/dateUtils";

// -----------------------------------------------------------------------------
// 📄 Component
// -----------------------------------------------------------------------------
const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
  });

  // ---------------------------------------------------------------------------
  // 🔄 Load profile on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          title: data.title || "",
          summary: data.summary || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          // Convert education ISO → YYYY‑MM for input value
          education: Array.isArray(data.education)
            ? data.education.map((e) => ({
                ...e,
                startDate: isoToMonthStr(e.startDate),
                endDate: isoToMonthStr(e.endDate),
              }))
            : [],
          // Convert experience ISO → month/year dropdown values
          experience: Array.isArray(data.experience)
            ? data.experience.map((ex) => ({
                ...ex,
                startMonth: isoToMonthName(ex.startDate),
                startYear: isoToYear(ex.startDate),
                endMonth: isoToMonthName(ex.endDate),
                endYear: isoToYear(ex.endDate),
              }))
            : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, []);

  // ---------------------------------------------------------------------------
  // 🖊️  Generic handlers
  // ---------------------------------------------------------------------------
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Skills as CSV → array
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };

  // Nested field updater (experience / education / projects)
  const handleNestedChange = (field, idx, key, value) => {
    const copy = [...formData[field]];
    copy[idx] = { ...copy[idx], [key]: value };
    setFormData((prev) => ({ ...prev, [field]: copy }));
  };

  // Add & remove helpers
  const addNestedItem = (field, defaultObj) =>
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], defaultObj] }));

  const removeNestedItem = (field, idx) =>
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));

  // ---------------------------------------------------------------------------
  // 💾 Submit
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      ...formData,
      // Convert education back to ISO
      education: formData.education.map((ed) => ({
        ...ed,
        startDate: monthStrToISO(ed.startDate),
        endDate: monthStrToISO(ed.endDate),
      })),
      // Convert experience month/year → ISO
      experience: formData.experience.map((ex) => ({
        ...ex,
        startDate: monthYearToISO(ex.startMonth, ex.startYear),
        endDate: monthYearToISO(ex.endMonth, ex.endYear),
      })),
    };

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) alert("Profile saved!");
      else alert("Failed to save profile.");
    } catch (err) {
      console.error(err);
      alert("Network error. Try again.");
    }
  };

  // ---------------------------------------------------------------------------
  // 🖼️  JSX
  // ---------------------------------------------------------------------------
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── Basic Info ─────────────────────────────────────────── */}
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          value={user?.email || ""}
          disabled
          className="w-full p-2 border rounded" />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border rounded"
        />

        {/* ─── Headline & Summary ─────────────────────────────────── */}
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Current Job Title"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Professional Summary"
          className="w-full p-2 border rounded"
          rows={4}
        />

        {/* ─── Skills ──────────────────────────────────────────────── */}
        <input
          value={formData.skills.join(", ")}
          onChange={handleSkillsChange}
          placeholder="Skills (comma‑separated)"
          className="w-full p-2 border rounded"
        />

        {/* ─── Experience ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Experience</h2>
          {formData.experience.length === 0 && (
            <p className="text-gray-500 mb-2">No experience added yet.</p>
          )}

          {formData.experience.map((job, idx) => (
            <div key={idx} className="mb-4 border p-4 rounded">
              {/* Title & Company */}
              <input
                placeholder="Job Title"
                value={job.title || ""}
                onChange={(e) => handleNestedChange("experience", idx, "title", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                placeholder="Company"
                value={job.company || ""}
                onChange={(e) => handleNestedChange("experience", idx, "company", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />

              {/* Start & End month/year */}
              <div className="flex gap-2 mb-2">
                {/* Start */}
                <label className="flex-1">
                  <span className="text-xs text-gray-600">Start month</span>
                  <select
                    value={job.startMonth || ""}
                    onChange={(e) => handleNestedChange("experience", idx, "startMonth", e.target.value)}
                    className="w-full p-2 border rounded" required>
                    <option value="">Month</option>
                    {months.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </label>
                <label className="flex-1">
                  <span className="text-xs text-gray-600">Start year</span>
                  <select
                    value={job.startYear || ""}
                    onChange={(e) => handleNestedChange("experience", idx, "startYear", e.target.value)}
                    className="w-full p-2 border rounded" required>
                    <option value="">Year</option>
                    {years.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </label>
              </div>
              <div className="flex gap-2 mb-2">
                {/* End */}
                <label className="flex-1">
                  <span className="text-xs text-gray-600">End month</span>
                  <select
                    value={job.endMonth || ""}
                    onChange={(e) => handleNestedChange("experience", idx, "endMonth", e.target.value)}
                    className="w-full p-2 border rounded" required>
                    <option value="">Month</option>
                    {months.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </label>
                <label className="flex-1">
                  <span className="text-xs text-gray-600">End year</span>
                  <select
                    value={job.endYear || ""}
                    onChange={(e) => handleNestedChange("experience", idx, "endYear", e.target.value)}
                    className="w-full p-2 border rounded" required>
                    <option value="">Year</option>
                    {years.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </label>
              </div>

              {/* Bullets */}
              <textarea
                placeholder="Bullets (new line = new bullet)"
                value={Array.isArray(job.bullets) ? job.bullets.join("\n") : ""}
                onChange={(e) => handleNestedChange("experience", idx, "bullets", e.target.value.split("\n"))}
                className="w-full p-2 border rounded"
                rows={3}
              />

              <button
                type="button"
                onClick={() => removeNestedItem("experience", idx)}
                className="mt-2 text-red-600 hover:underline"
              >
                Remove Experience
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              addNestedItem("experience", {
                title: "",
                company: "",
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                bullets: [],
              })}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            + Add Experience
          </button>
        </section>

        {/* ─── Education ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Education</h2>
          {formData.education.length === 0 && (
            <p className="text-gray-500 mb-2">No Education added yet.</p>
          )}

          {formData.education.map((ed, idx) => (
            <div key={idx} className="mb-4 border p-4 rounded">
              {/* School */}
              <input
                placeholder="Wilfrid Laurier University"
                value={ed.school|| ""}
                onChange={(e) => handleNestedChange("education", idx, "school", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                placeholder="Computer Science"
                value={ed.degree|| ""}
                onChange={(e) => handleNestedChange("education", idx, "degree", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />

              {/* Start & End month/year */}
              <div className="flex gap-2 mb-2">
                {/* Start */}
                <label className="flex-1">
                  <span className="text-xs text-gray-600">Start month</span>
                  <select
                    value={ed.startMonth|| ""}
                    onChange={(e) => handleNestedChange("education", idx, "startMonth", e.target.value)}
                    className="w-full p-2 border rounded" required>
                    <option value="">Month</option>
                    {months.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </label>
                <label className="flex-1">
                  <span className="text-xs text-gray-600">Start year</span>
                  <select
                    value={ed.startYear || ""}
                    onChange={(e) => handleNestedChange("education", idx, "startYear", e.target.value)}
                    className="w-full p-2 border rounded" required>
                    <option value="">Year</option>
                    {years.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </label>
              </div>
              <div className="flex gap-2 mb-2">
                {/* End */}
                <label className="flex-1">
                  <span className="text-xs text-gray-600">End month</span>
                  <select
                    value={ed.endMonth || ""}
                    onChange={(e) => handleNestedChange("education", idx, "endMonth", e.target.value)}
                    className="w-full p-2 border rounded" required>
                    <option value="">Month</option>
                    {months.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </label>
                <label className="flex-1">
                  <span className="text-xs text-gray-600">End year</span>
                  <select
                    value={ed.endYear || ""}
                    onChange={(e) => handleNestedChange("education", idx, "endYear", e.target.value)}
                    className="w-full p-2 border rounded" required>
                    <option value="">Year</option>
                    {years.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </label>
              </div>

              {/* Bullets */}
              <textarea
                placeholder="Bullets (new line = new bullet)"
                value={Array.isArray(ed.bullets) ? ed.bullets.join("\n") : ""}
                onChange={(e) => handleNestedChange("education", idx, "bullets", e.target.value.split("\n"))}
                className="w-full p-2 border rounded"
                rows={3}
              />

              <button
                type="button"
                onClick={() => removeNestedItem("education", idx)}
                className="mt-2 text-red-600 hover:underline"
              >
                Remove Education
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              addNestedItem("education", {
                title: "",
                company: "",
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                bullets: [],
              })}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            + Add Education
          </button>
        </section>

        {/* ─── Projects ───────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          {formData.projects.length === 0 && (
            <p className="text-gray-500 mb-2">No projects added yet.</p>
          )}
          {formData.projects.map((p, idx) => (
            <div key={idx} className="mb-4 border p-4 rounded">
              <input
                placeholder="Project Title"
                value={p.title || ""}
                onChange={(e) => handleNestedChange("projects", idx, "title", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                placeholder="Description"
                value={p.description || ""}
                onChange={(e) => handleNestedChange("projects", idx, "description", e.target.value)}
                className="w-full p-2 border rounded mb-2"
                rows={3}
              />
              <input
                placeholder="Link"
                value={p.link || ""}
                onChange={(e) => handleNestedChange("projects", idx, "link", e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeNestedItem("projects", idx)}
                className="mt-2 text-red-600 hover:underline"
              >
                Remove Project
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addNestedItem("projects", { title: "", description: "", link: "" })}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            + Add Project
          </button>
        </section>

        {/* ─── Save ──────────────────────────────────────────────── */}
        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
// ============================================================================
