import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  
  const [user, setUser] = useState(null); // Decoded user info
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (decodeError) {
        console.error("Invalid token on load:", decodeError);
        logout();
      }
    }
  }, [token]);
  
  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      setToken(token);
      setUser(decoded);
      localStorage.setItem("token", token);
    } catch (decodeError) {
      console.error("Failed to decode token during login:", decodeError);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };
  
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
