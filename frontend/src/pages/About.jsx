import React from "react";

export default function About() {
  return (
    <section className="max-w-4xl mx-auto py-16 px-4 text-purple-900">
      <h1 className="text-4xl font-extrabold mb-6 text-purple-700">About EduTech Skill Finder</h1>
      <p className="text-lg mb-4">EduTech Skill Finder is a next-generation platform designed to help learners discover, assess, and master tech skills. Powered by AI, it offers personalized recommendations, curated roadmaps, and expert mentorship for Python, SQL, Machine Learning, and more.</p>
      <ul className="list-disc ml-6 mb-6 text-base">
        <li>Personalized skill and course recommendations</li>
        <li>Interactive quizzes to assess your strengths</li>
        <li>Expert mentorship and curated learning paths</li>
        <li>Premium, visually stunning UI for an engaging experience</li>
        <li>Perfect for beginners and professionals looking to upskill</li>
      </ul>
      <p className="text-base">Our mission is to accelerate your tech career by making learning accessible, enjoyable, and effective. Join EduTech and unlock your potential!</p>
    </section>
  );
}
