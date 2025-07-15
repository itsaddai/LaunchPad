import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await fetch("http://localhost:5000/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApplications(data);
    };
    fetchApplications();
  }, [token]);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/applications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setApplications((prev) => prev.filter((a) => a._id !== id));
  };

  const handleEdit = (app) => {
    setFormData(app);
    setShowForm(true);
  };

  const handleDeleteAll = async () => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete all applications? This cannot be undone.'
  );
  if (!confirmDelete) return;

  try {
    await fetch('http://localhost:5000/api/applications', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    setApplications([]); // Clear all from local state
  } catch (err) {
    console.error('Error deleting all applications:', err);
  }
};


  const handleDuplicate = async (app) => {
    const copy = { ...app };
    delete copy._id;
    const res = await fetch("http://localhost:5000/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(copy),
    });
    const newApp = await res.json();
    setApplications((prev) => [newApp, ...prev]);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-600";
      case "Interviewing":
        return "bg-yellow-100 text-yellow-700";
      case "Offer":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-600";
      case "Ghosted":
        return "bg-gray-200 text-gray-500";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
  <div className="min-h-screen bg-[#e5e5e5] px-6 py-10 font-mono text-gray-900">
    <div className="max-w-4xl mx-auto">
      {/* Minimal Header Section */}
      <div className="mb-12 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Applications – {applications.length}
        </h1>
        <p className="text-base text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* App List */}
      <div className="grid grid-cols-1 gap-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium text-gray-800">
                  {app.company}
                </h2>
                <p className="text-gray-600">{app.position}</p>
                {app.notes && (
                  <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">
                    {app.notes}
                  </p>
                  
                )}
                 <button
      onClick={handleDeleteAll}
      className="fixed bottom-6 left-6 z-50 text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50 shadow-sm transition"
    >
      Delete All
    </button>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm px-2 py-1 rounded font-medium ${getStatusStyles(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>

                {/* 3-dot menu */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setApplications((prev) =>
                        prev.map((a) =>
                          a._id === app._id
                            ? { ...a, showMenu: !a.showMenu }
                            : { ...a, showMenu: false }
                        )
                      )
                    }
                    className="text-gray-500 hover:text-gray-800 text-xl"
                  >
                    ⋮
                  </button>

                  {app.showMenu && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                      <button
                        onClick={() => handleEdit(app)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleDuplicate(app)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        Duplicate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


        {/* Floating + Button */}
        <button
          onClick={() => {
            setFormData({});
            setShowForm(true);
          }}
          className="fixed bottom-8 right-8 bg-black text-white rounded-full w-14 h-14 text-3xl flex items-center justify-center shadow-lg hover:bg-gray-900 transition"
        >
          +
        </button>

        {/* Placeholder for Form Modal */}
        {showForm && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        {formData._id ? "Edit Application" : "Add Application"}
      </h2>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Company"
          value={formData.company || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, company: e.target.value }))
          }
          className="w-full border rounded-lg p-2"
        />
        <input
          type="text"
          placeholder="Position"
          value={formData.position || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, position: e.target.value }))
          }
          className="w-full border rounded-lg p-2"
        />
        <select
          value={formData.status || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, status: e.target.value }))
          }
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Status</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Ghosted">Ghosted</option>
        </select>
        <textarea
          placeholder="Notes"
          value={formData.notes || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() => setShowForm(false)}
          className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            const method = formData._id ? "PUT" : "POST";
            const url = formData._id
              ? `http://localhost:5000/api/applications/${formData._id}`
              : "http://localhost:5000/api/applications";

            const res = await fetch(url, {
              method,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(formData),
            });

            const saved = await res.json();
            if (method === "POST") {
              setApplications((prev) => [saved, ...prev]);
            } else {
              setApplications((prev) =>
                prev.map((a) => (a._id === saved._id ? saved : a))
              );
            }

            setShowForm(false);
            setFormData({});
          }}
          className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800"
        >
          Save
        </button>
      </div>
    </div>
  </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
