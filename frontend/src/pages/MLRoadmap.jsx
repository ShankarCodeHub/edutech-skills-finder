import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const steps = [
  "Study ML algorithms and concepts",
  "Use scikit-learn for modeling",
  "Data preprocessing and feature engineering",
  "Build and evaluate ML projects",
  "Explore deep learning basics"
];

export default function MLRoadmap() {
  return (
    <>
      <Navbar />
      <section className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-extrabold mb-8 text-purple-700 text-center">Machine Learning Roadmap</h1>
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
      </section>
      <Footer />
    </>
  );
}
