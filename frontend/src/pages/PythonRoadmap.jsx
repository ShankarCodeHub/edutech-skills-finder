import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const steps = [
  "Learn syntax, variables, and data types",
  "Practice loops and conditionals",
  "Explore functions and modules",
  "Work with NumPy and Pandas",
  "Build small Python projects"
];

export default function PythonRoadmap() {
  return (
    <>
      <Navbar />
      <section className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-extrabold mb-8 text-purple-700 text-center">Python Roadmap</h1>
        <div className="relative bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-8 mb-12">
          <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-purple-400/30 blur-[60px] animate-blob" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 w-24 h-24 rounded-full bg-purple-300/30 blur-[40px] animate-blob delay-2000" />
          <ol className="list-decimal ml-8 space-y-3 text-purple-900 text-lg">
            {steps.map((step, i) => (
              <li key={i} className="relative pl-2">
                <span className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow" />
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-12">
          {/* Section 1: Python Basics */}
          <div className="relative bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-8 mb-12">
            <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-purple-400/30 blur-[60px] animate-blob" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-24 h-24 rounded-full bg-purple-300/30 blur-[40px] animate-blob delay-2000" />
            <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-300 text-white grid place-items-center font-bold mr-2">1</span>
              Python Basics
            </h2>
            <ol className="list-decimal ml-8 space-y-3 text-purple-900 text-lg">
              <li>Learn syntax, variables, and data types</li>
              <li>Practice loops and conditionals</li>
              <li>Explore functions and modules</li>
              <li>Work with NumPy and Pandas</li>
            </ol>
          </div>
          {/* Section 2: Python Projects */}
          <div className="relative bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-8 mb-12">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-300 text-white grid place-items-center font-bold mr-2">2</span>
              Python Projects
            </h2>
            <ol className="list-decimal ml-8 space-y-3 text-purple-900 text-lg">
              <li>Build small Python projects (calculator, to-do app, web scraper)</li>
              <li>Apply OOP concepts and error handling</li>
              <li>Explore file I/O and APIs</li>
              <li>Share your code on GitHub</li>
            </ol>
          </div>
          {/* Section 3: Python for Data Science */}
          <div className="relative bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-8 mb-12">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-300 text-white grid place-items-center font-bold mr-2">3</span>
              Python for Data Science
            </h2>
            <ol className="list-decimal ml-8 space-y-3 text-purple-900 text-lg">
              <li>Learn data analysis with Pandas</li>
              <li>Visualize data with Matplotlib/Seaborn</li>
              <li>Work with CSV, Excel, and JSON files</li>
              <li>Explore Jupyter Notebooks</li>
            </ol>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
