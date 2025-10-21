import React from "react";
import Hero from "./Hero";
import Courses from "./Courses";
import Chatbot from "./Chatbot";
import Roadmap from "./Roadmap";
import { Link } from 'react-router-dom';

export default function Home() {
  const isLoggedIn = !!localStorage.getItem('auth_token');
  
  return (
    <div className="bg-purple-50 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-6">
        <Hero />
        {/* Dashboard Section for scroll - now includes login/register and roadmap info */}
        <section id="dashboard" className="my-12 p-8 rounded-2xl bg-white shadow-lg border border-purple-200">
          <h2 className="text-3xl font-extrabold text-purple-700 mb-4">Dashboard</h2>
          <p className="text-lg text-purple-600 mb-4">
            Welcome to your personalized dashboard! Here you can track your progress, view recommended courses, and access your learning roadmap.
          </p>
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow hover:scale-105 transition text-lg"
            >
              🚀 Go to Full Dashboard
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1">
                <p className="text-purple-700 font-semibold mb-2">
                  Please log in to access your personalized dashboard with:
                </p>
                <ul className="list-disc list-inside text-purple-600 mb-4 space-y-1">
                  <li>AI-powered skill assessments</li>
                  <li>Progress tracking and analytics</li>
                  <li>Personalized learning paths</li>
                  <li>Expert mentor connections</li>
                </ul>
              </div>
              <Link
                to="/login"
                className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold shadow-lg hover:scale-105 transition text-lg whitespace-nowrap"
              >
                Student Login
              </Link>
            </div>
          )}
        </section>
        <Roadmap />
        <Courses />
        <Chatbot />
      </main>
    </div>
  );
}
