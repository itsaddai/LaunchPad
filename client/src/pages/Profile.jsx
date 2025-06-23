import React, { useState, useEffect } from "react";
import axios from "axios";

const emptyExperience = {
  company: "",
  dateRange: "",
  bullets: [""], // start with one bullet
};

const emptyProject = {
  title: "",
  description: "",
  stack: "",
};

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    summary: "",
    skills: "",
    education: "",
    experience: [],
    projects: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (res.data) {
          // Ensure experience and projects are arrays
          setFormData({
            ...res.data,
            experience: res.data.experience || [],
            projects: res.data.projects || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Experience handlers
  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index][field] = value;
    setFormData({ ...formData, experience: newExperience });
  };

  const handleBulletChange = (expIndex, bulletIndex, value) => {
    const newExperience = [...formData.experience];
    newExperience[expIndex].bullets[bulletIndex] = value;
    setFormData({ ...formData, experience: newExperience });
  };

  const addBullet = (expIndex) => {
    const newExperience = [...formData.experience];
    newExperience[expIndex].bullets.push("");
    setFormData({ ...formData, experience: newExperience });
  };

  const removeBullet = (expIndex, bulletIndex) => {
    const newExperience = [...formData.experience];
    if (newExperience[expIndex].bullets.length > 1) {
      newExperience[expIndex].bullets.splice(bulletIndex, 1);
      setFormData({ ...formData, experience: newExperience });
    }
  };

  const addExperience = () => {
    setFormData({ ...formData, experience: [...formData.experience, { ...emptyExperience }] });
  };

  const removeExperience = (index) => {
    const newExperience = [...formData.experience];
    newExperience.splice(index, 1);
    setFormData({ ...formData, experience: newExperience });
  };

  // Projects handlers
  const handleProjectChange = (index, field, value) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value;
    setFormData({ ...formData, projects: newProjects });
  };

  const addProject = () => {
    setFormData({ ...formData, projects: [...formData.projects, { ...emptyProject }] });
  };

  const removeProject = (index) => {
    const newProjects = [...formData.projects];
    newProjects.splice(index, 1);
    setFormData({ ...formData, projects: newProjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile saved successfully!");
    } catch (err) {
      console.error("Error saving profile", err);
      alert("Error saving profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Professional Title (e.g. Software Engineer)"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Professional Summary (2-3 lines)"
          className="w-full p-2 border rounded"
          rows={3}
        />
        <textarea
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Key Skills (comma separated)"
          className="w-full p-2 border rounded"
          rows={2}
        />
        <textarea
          name="education"
          value={formData.education}
          onChange={handleChange}
          placeholder="Education (e.g. BSc in Computer Science, Laurier, 2025)"
          className="w-full p-2 border rounded"
          rows={2}
        />

        {/* Experience Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Work Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              aria-label="Add experience"
              className="text-2xl font-bold text-gray-600 hover:text-gray-900"
            >
              +
            </button>
          </div>
          {formData.experience.length === 0 && (
            <p className="text-gray-500 italic mb-4">No work experience added yet.</p>
          )}
          {formData.experience.map((exp, idx) => (
            <div key={idx} className="mb-6 border p-4 rounded relative">
              <button
                type="button"
                onClick={() => removeExperience(idx)}
                aria-label="Remove experience"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
              >
                &times;
              </button>
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Date Range (e.g. Jan 2022 - Dec 2023)"
                value={exp.dateRange}
                onChange={(e) => handleExperienceChange(idx, "dateRange", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <div>
                <label className="block font-semibold mb-1">Responsibilities / Achievements</label>
                {exp.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-center mb-1">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => handleBulletChange(idx, bIdx, e.target.value)}
                      placeholder="Add bullet point"
                      className="flex-grow p-2 border rounded"
                    />
                    {exp.bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBullet(idx, bIdx)}
                        aria-label="Remove bullet point"
                        className="ml-2 text-red-500 hover:text-red-700 font-bold"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addBullet(idx)}
                  className="mt-1 text-sm text-blue-600 hover:underline"
                >
                  + Add bullet point
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Projects</h2>
            <button
              type="button"
              onClick={addProject}
              aria-label="Add project"
              className="text-2xl font-bold text-gray-600 hover:text-gray-900"
            >
              +
            </button>
          </div>
          {formData.projects.length === 0 && (
            <p className="text-gray-500 italic mb-4">No projects added yet.</p>
          )}
          {formData.projects.map((proj, idx) => (
            <div key={idx} className="mb-6 border p-4 rounded relative">
              <button
                type="button"
                onClick={() => removeProject(idx)}
                aria-label="Remove project"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
              >
                &times;
              </button>
              <input
                type="text"
                placeholder="Project Title"
                value={proj.title}
                onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                placeholder="Project Description"
                value={proj.description}
                onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                className="w-full p-2 border rounded mb-2"
                rows={3}
              />
              <input
                type="text"
                placeholder="Tech Stack (e.g. React, Node.js)"
                value={proj.stack}
                onChange={(e) => handleProjectChange(idx, "stack", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
