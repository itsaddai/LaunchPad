import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-4 transition-all duration-300 hover:scale-105">
        Welcome to LaunchPad 🚀
      </h1>
      <p className="text-lg mb-6 text-gray-600">
        Track your internship applications in one clean, intuitive dashboard.
      </p>
      <div className="space-x-4">
        <a href="/login" className="px-4 py-2 bg-black text-white rounded transition-all duration-300 hover:scale-105">Login</a>
        <a href="/register" className="px-4 py-2 border border-black rounded hover:bg-gray-100">Register</a>
        
      </div>
      <footer className="absolute bottom-4 text-center w-full text-sm text-gray-400">
        © {new Date().getFullYear()} LaunchPad. All rights reserved.
      </footer>
    </div>
    
  );
}
