import React, { useEffect, useState } from "react";
import API from '../api/api';

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    API.get('/mentors/admin/all-sessions')
      .then(res => setSessions(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Failed to load sessions."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-blue-700">Loading sessions...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-bold">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">All Booked Sessions</h2>
      {sessions.length === 0 ? (
        <div className="text-blue-700">No sessions booked yet.</div>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2">Mentor</th>
              <th className="p-2">Student</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">College</th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Topic</th>
              <th className="p-2">Photo</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, idx) => (
              <tr key={s.sessionId || idx} className="border-t">
                <td className="p-2 font-bold text-blue-700">{s.mentorName}</td>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.phone}</td>
                <td className="p-2">{s.college}</td>
                <td className="p-2">{s.date}</td>
                <td className="p-2">{s.time}</td>
                <td className="p-2">{s.topic}</td>
                <td className="p-2">{s.photo ? <img src={s.photo} alt="student" className="w-10 h-10 object-cover rounded-full" /> : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
