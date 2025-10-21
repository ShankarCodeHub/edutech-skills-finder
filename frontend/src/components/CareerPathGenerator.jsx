import React, { useState } from "react";
import API from '../api/api';

const examplePaths = [
  {
    interest: "data + coding",
    path: ["Python", "SQL", "Machine Learning", "Data Analysis", "Statistics"]
  },
  {
    interest: "web development",
    path: ["HTML", "CSS", "JavaScript", "React", "Node.js"]
  },
  {
    interest: "ai",
    path: ["Python", "Machine Learning", "Deep Learning", "AI Ethics", "TensorFlow"]
  },
  {
    interest: "cloud",
    path: ["Linux", "Networking", "AWS", "Docker", "Kubernetes"]
  },
  {
    interest: "cybersecurity",
    path: ["Networking", "Linux", "Security Basics", "Pen Testing", "Cryptography"]
  },
  {
    interest: "mobile",
    path: ["Java", "Kotlin", "Android Studio", "Flutter", "React Native"]
  }
];

export default function CareerPathGenerator() {
  const props = arguments[0] || {};
  const paths = props.careerPaths || examplePaths;
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSuggest(selectedInterest) {
    setError("");
    setLoading(true);
    setSuggestion(null);
    const interestText = selectedInterest ? selectedInterest : input.trim();
    if (!interestText) {
      setError("Please enter your interests.");
      setLoading(false);
      return;
    }
    try {
      // Call backend AI API
      const res = await API.post('/ai-response', {
        question: `Suggest a personalized skill learning path for a student interested in: ${interestText}. List the skills in order.`
      });
      const answer = res.data?.answer || "";
      // Parse skills from answer (expect comma or arrow separated)
      let skills = answer.split(/,|→|->|\n|\r/).map(s => s.trim()).filter(Boolean);
      if (skills.length === 0) skills = [answer];
      setSuggestion(skills);
      setInput(interestText);
    } catch (err) {
      setError("AI suggestion failed. Showing example paths.");
      // Fallback to static example
      const normalized = interestText.toLowerCase();
      const found = paths.find(e => normalized.includes(e.interest));
      setSuggestion(found ? found.path : []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col items-center">
      <h3 className="text-lg font-bold text-blue-700 mb-2">Find Your Skill Path</h3>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Describe your interests (e.g., data + coding)"
        className="w-full max-w-xs px-4 py-2 rounded-lg border border-blue-200 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={() => handleSuggest()}
        className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 transition"
        disabled={loading}
      >
        {loading ? "Suggesting..." : "Suggest Path"}
      </button>
      {(error || suggestion) && (
        <div className="mt-6 text-center">
          {error && <div className="text-red-600 font-semibold mb-2">{error}</div>}
          {suggestion && suggestion.length > 0 && (
            <>
              <div className="text-blue-800 font-semibold mb-2">Suggested Path:</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestion.map((skill, idx) => (
                  <span key={skill} className="px-4 py-2 rounded-full bg-blue-200 text-blue-900 font-bold shadow">
                    {skill}
                    {idx < suggestion.length - 1 && <span className="mx-2">→</span>}
                  </span>
                ))}
              </div>
            </>
          )}
          {suggestion && suggestion.length === 0 && (
            <div className="text-red-600 font-semibold mb-2">No matching path found. Try one of these interests:</div>
          )}
          {suggestion && suggestion.length === 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {paths.map(p => (
                <button
                  key={p.interest}
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-300 transition"
                  onClick={() => handleSuggest(p.interest)}
                  style={{ cursor: 'pointer' }}
                >
                  {p.interest}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
