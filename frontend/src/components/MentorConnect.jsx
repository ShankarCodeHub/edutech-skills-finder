import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const mentors = [
  { id: "alice", name: "Dr. Alice Smith", expertise: "AI & Data Science", avatar: "🧑‍🔬" },
  { id: "john", name: "Mr. John Doe", expertise: "Web Development", avatar: "🧑‍💻" },
  { id: "priya", name: "Ms. Priya Patel", expertise: "Cloud & DevOps", avatar: "🧑‍🚀" }
];

function isLoggedIn() {
  try {
    const token = localStorage.getItem('auth_token');
    return !!token;
  } catch {
    return false;
  }
}

export default function MentorConnect() {
  const navigate = useNavigate();
  const [mentorList, setMentorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    API.get('/mentors')
      .then(res => {
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : [];
        // Ensure each mentor has id, name
        const valid = data.filter(m => m && typeof m.id === 'string' && m.id);
        if (valid.length > 0) {
          setMentorList(valid);
        } else {
          setMentorList(mentors); // fallback to local list
        }
      })
      .catch(() => {
        if (!mounted) return;
        setError('Unable to load mentors from server. Showing defaults.');
        setMentorList(mentors);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-lg font-bold text-blue-700 mb-2">Mentor Connect</h3>
      {error && (
        <div className="mb-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-1 text-sm">{error}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4 w-full">
        {loading ? (
          <div className="text-blue-700">Loading mentors...</div>
        ) : mentorList.length === 0 ? (
          <div className="text-blue-700">No mentors available.</div>
        ) : mentorList.map(mentor => (
          <div key={mentor.id || mentor.name} className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4">
            <span className="text-4xl mb-2">{mentor.avatar || "🧑‍🏫"}</span>
            <span className="font-bold text-blue-900">{mentor.name}</span>
            <span className="text-sm text-blue-600 mb-2">{mentor.expertise}</span>
            <button
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 transition mb-2"
              onClick={() => {
                if (!mentor?.id) {
                  console.warn('MentorConnect: Missing mentor.id for', mentor);
                  return;
                }
                if (!isLoggedIn()) {
                  // Save intent and mentor, then redirect to login
                  localStorage.setItem('mentor_booking_intent', mentor.id);
                  navigate('/login');
                } else {
                  navigate(`/mentors/${mentor.id}`, { state: { booking: true } });
                }
              }}
            >
              Book a Session
            </button>
            <button
              className="px-4 py-2 rounded-lg border border-blue-300 text-blue-700 font-semibold shadow hover:scale-105 transition"
              onClick={() => {
                if (!mentor?.id) {
                  console.warn('MentorConnect: Missing mentor.id for', mentor);
                  return;
                }
                navigate(`/mentors/${mentor.id}`)
              }}
            >
              Ask a Question
            </button>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-600">Connect with mentors for guidance and support.</div>
    </div>
  );
}
