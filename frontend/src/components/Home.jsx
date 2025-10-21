import React from "react";
import Hero from "./Hero";
import Courses from "./Courses";
import Chatbot from "./Chatbot";
import Roadmap from "./Roadmap";
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-purple-50 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-6">
        <Hero />
        {/* Dashboard Section for scroll - now includes login/register and roadmap info */}
        <section id="dashboard" className="my-12 p-8 rounded-2xl bg-white shadow-lg border border-purple-200">
          <h2 className="text-3xl font-extrabold text-purple-700 mb-4">Dashboard</h2>
          <p className="text-lg text-purple-600 mb-4">Welcome to your personalized dashboard! Here you can track your progress, view recommended courses, and access your learning roadmap.</p>
          {/* Removed login, admin login, admin register buttons as requested */}
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow hover:scale-105 transition text-lg"
          >
            Go to Full Dashboard
          </Link>
        </section>
        <Roadmap />
        <Courses />
        <Chatbot />
      </main>
    </div>
  );
}
