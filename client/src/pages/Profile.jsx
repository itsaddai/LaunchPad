import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to view your profile.');
        return;
      }

      try {
        const res = await fetch('https://launchpad-backend.onrender.com/api/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setMessage('Failed to load profile.');
          return;
        }

        const data = await res.json();
        
        if (data && Object.keys(data).length !== 0) {  // check if profile data exists
  setName(data.fullName || '');
  setEmail(data.email || '');
  setPhone(data.phoneNumber || '');
  setLinkedin(data.linkedin || '');
  setMessage('');
} else {
  setMessage('No profile data found.');
}
      } catch (err) {
        console.error('Error loading profile:', err);
        setMessage('An error occurred while loading your profile.');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    // Basic validation example
    if (!name || !email || !phone) {
      setMessage('Please fill in all required fields: name, email, phone.');
      return;
    }

    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to update your profile.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://launchpad-backend.onrender.com/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: name,
        email,
        phoneNumber: phone,
        linkedin, }),
      });

      if (!res.ok) {
        let errorData = {};
        try {
          errorData = await res.json();
        } catch (jsonErr) {
          console.error('Failed to parse error response JSON', jsonErr);
        }
        const errMsg = errorData.message || 'Unknown error occurred.';
        setMessage(`Failed to update profile: ${errMsg}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log('Profile updated successfully:', data);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Network or unexpected error:', error);
      setMessage('Failed to update profile: Network or unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Full Name"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl"
      />

      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Your Phone Number"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl"
      />

      <input
        type="text"
        value={linkedin}
        onChange={(e) => setLinkedin(e.target.value)}
        placeholder="LinkedIn URL (optional)"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>

      {message && <p className="mt-4 text-center text-sm text-blue-600">{message}</p>}
    </div>
  );
};

export default Profile;
