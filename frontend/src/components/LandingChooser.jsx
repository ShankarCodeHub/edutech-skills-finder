import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingChooser() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center animate-fade-in">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">EduTech Skills Finder</h1>
        <h2 className="text-lg text-blue-500 mb-6">Choose your role to get started</h2>
        <div className="flex gap-8 mb-6">
          <button
            className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 focus:outline-none"
            onClick={() => navigate("/dashboard")}
          >
            Student Panel
          </button>
          <button
            className="px-8 py-4 rounded-full bg-gray-100 text-blue-700 font-bold text-xl shadow-lg hover:bg-blue-200 hover:scale-105 transition-all duration-200 focus:outline-none"
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </button>
        </div>
        <p className="text-sm text-gray-500">Note: You can switch roles anytime from the dashboard.</p>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.7s ease; }
      `}</style>
    </div>
  );
}
