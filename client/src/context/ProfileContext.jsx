import React, { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    summary: "",
    skills: "",
    education: "",
    experience: [],
    projects: [],
  });

  return (
    <ProfileContext.Provider value={{ formData, setFormData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
