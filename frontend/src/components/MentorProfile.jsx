import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from '../api/api';

export default function MentorProfile() {

  const { mentorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [question, setQuestion] = useState("");
  // const [qa, setQa] = useState([]);
  const [booking, setBooking] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    college: "",
    photo: null,
    bio: "",
    date: "",
    time: "",
    topic: ""
  });

  // Ensure all fields are always defined as strings (except photo)
  useEffect(() => {
    setSessionInfo(s => ({
      name: s.name || "",
      email: s.email || "",
      phone: s.phone || "",
      location: s.location || "",
      college: s.college || "",
      photo: s.photo || null,
      bio: s.bio || "",
      date: s.date || "",
      time: s.time || "",
      topic: s.topic || ""
    }));
    // eslint-disable-next-line
  }, []);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [replyInputs, setReplyInputs] = useState({});

  // Fetch mentor data from backend
  const fetchMentor = () => {
    // Guard: avoid calling API with undefined id
    if (!mentorId || typeof mentorId !== 'string') {
      setMentor(null);
      setError('Invalid mentor link.');
      setNotFound(false);
      setLoading(false);
      console.warn('MentorProfile: mentorId is undefined');
      return;
    }
    setLoading(true);
    setError("");
    setNotFound(false);
    API.get(`/mentors/${mentorId}`)
      .then(res => {
        setMentor(res.data);
        setBooked(false);
        setSessionInfo({ date: "", topic: "" });
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 404) {
          setNotFound(true);
          setError("Mentor not found");
        } else {
          setError("Backend is unreachable. Please ensure the server is running on http://localhost:5000 and try again.");
        }
        setMentor(null);
      })
      .finally(() => setLoading(false));
  };

  const fetchSessions = () => {
    if (!mentorId) return;
    API.get(`/mentors/${mentorId}/sessions`)
      .then(res => setSessions(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSessions([]));
  };

  useEffect(() => {
    fetchMentor();
    fetchSessions();
    // Booking intent after login
    const intent = localStorage.getItem('mentor_booking_intent');
    if (intent === mentorId) {
      setBooking(true);
      localStorage.removeItem('mentor_booking_intent');
    } else if (location.state && location.state.booking) {
      setBooking(true);
    } else {
      setBooking(false);
    }
    // eslint-disable-next-line
  }, [mentorId, location.state]);

  async function handleAsk() {
    if (!question.trim()) return;
    try {
      await API.post(`/mentors/${mentorId}/question`, { text: question });
      setQuestion("");
      fetchMentor(); // Refresh mentor data after asking
    } catch {
      alert("Failed to submit question.");
    }
  }

  async function handleReply(idx) {
    const reply = replyInputs[idx];
    if (!reply || !reply.trim()) return;
    try {
      await API.post(`/mentors/${mentorId}/reply`, { index: idx, reply });
      setReplyInputs(inputs => ({ ...inputs, [idx]: "" }));
      fetchMentor();
    } catch {
      alert("Failed to submit reply.");
    }
  }

  async function handleBook(e) {
    e.preventDefault();
    const { name, email, phone, location, college, bio, date, time, topic, photo } = sessionInfo;
    if (!name || !email || !date || !topic) {
      alert("Please fill in all required fields.");
      return;
    }
    let photoUrl = "";
    if (photo) {
      const formData = new FormData();
      formData.append("avatar", photo);
      try {
        const uploadRes = await API.post("/profile/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
        photoUrl = uploadRes.data.avatarUrl || "";
      } catch (err) {
        if (err?.response?.status === 401) {
          alert("You must be logged in to upload a photo. Please log in and try again.");
        } else {
          alert("Photo upload failed. Try again or use a different image.");
        }
        return;
      }
    }
    try {
      const res = await API.post(`/mentors/${mentorId}/book`, {
        name, email, phone, location, college, bio, date, time, topic, photo: photoUrl
      });
      const sessionId = res.data.sessionId;
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (sessionId) navigate(`/mentors/${mentorId}/session/${sessionId}`);
      }, 1800);
    } catch {
      alert("Failed to book session.");
    }
  }

  if (loading) return <div className="p-8 text-center text-blue-700">Loading mentor...</div>;
  if (!mentor) {
    return (
      <div className="p-8 text-center">
        {notFound ? (
          <div className="text-red-600 font-bold">Mentor not found. Please check the link or try again later.</div>
        ) : (
          <div className="text-red-600 font-semibold">
            {error || 'Unable to load mentor. Please try again.'}
          </div>
        )}
        <button
          onClick={fetchMentor}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-5xl">{mentor.avatar}</span>
        <div>
          <div className="text-2xl font-bold text-blue-900">{mentor.name}</div>
          <div className="text-blue-600 font-semibold">{mentor.expertise}</div>
          <div className="text-gray-500 text-sm mt-1">{mentor.bio}</div>
        </div>
      </div>
      {booking && !booked && (
        <form className="bg-blue-50 rounded-lg p-4 mb-4" onSubmit={handleBook}>
          <h4 className="text-lg font-bold text-blue-700 mb-2">Book a Session</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Name*</label>
              <input type="text" value={sessionInfo.name} onChange={e => setSessionInfo(s => ({ ...s, name: e.target.value }))} className="w-full px-3 py-2 rounded border border-blue-200" required />
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Email*</label>
              <input type="email" value={sessionInfo.email} onChange={e => setSessionInfo(s => ({ ...s, email: e.target.value }))} className="w-full px-3 py-2 rounded border border-blue-200" required />
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Phone</label>
              <input type="tel" value={sessionInfo.phone} onChange={e => setSessionInfo(s => ({ ...s, phone: e.target.value }))} className="w-full px-3 py-2 rounded border border-blue-200" />
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Location</label>
              <input type="text" value={sessionInfo.location} onChange={e => setSessionInfo(s => ({ ...s, location: e.target.value }))} className="w-full px-3 py-2 rounded border border-blue-200" />
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-1">College</label>
              <input type="text" value={sessionInfo.college} onChange={e => setSessionInfo(s => ({ ...s, college: e.target.value }))} className="w-full px-3 py-2 rounded border border-blue-200" />
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Photo</label>
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files[0];
                setSessionInfo(s => ({ ...s, photo: file }));
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => setPhotoPreview(ev.target.result);
                  reader.readAsDataURL(file);
                } else {
                  setPhotoPreview(null);
                }
              }} className="w-full px-3 py-2 rounded border border-blue-200" />
              {photoPreview && <img src={photoPreview} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-full border" />}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-blue-900 font-semibold mb-1">Short Bio</label>
              <textarea value={sessionInfo.bio} onChange={e => setSessionInfo(s => ({ ...s, bio: e.target.value }))} className="w-full px-3 py-2 rounded border border-blue-200" rows={2} />
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Date*</label>
              <input type="date" value={sessionInfo.date} onChange={e => setSessionInfo(s => ({ ...s, date: e.target.value }))} className="w-full px-3 py-2 rounded border border-blue-200" required />
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Time</label>
              <input type="time" value={sessionInfo.time} onChange={e => setSessionInfo(s => ({ ...s, time: e.target.value }))} className="w-full px-3 py-2 rounded border border-blue-200" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-blue-900 font-semibold mb-1">Topic / Problem*</label>
              <input type="text" value={sessionInfo.topic} onChange={e => setSessionInfo(s => ({ ...s, topic: e.target.value }))} className="w-full px-3 py-2 rounded border border-blue-200" required />
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 transition">Book</button>
          {showSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg font-semibold text-center animate-bounceIn">Session booked successfully!</div>
          )}
        </form>
      )}
      {booked && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg font-semibold">Session booked for {sessionInfo.date} on {sessionInfo.topic}!</div>}
      {sessions && sessions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-bold text-blue-700 mb-1">Your Sessions</h4>
          <ul className="space-y-1">
            {sessions.map((s) => (
              <li key={s.sessionId} className="text-blue-900 text-sm bg-blue-50 rounded px-2 py-1 cursor-pointer hover:bg-blue-100" onClick={() => navigate(`/mentors/${mentorId}/session/${s.sessionId}`)}>
                <span className="font-bold">{s.user}</span>: {s.date} — {s.topic}
              </li>
            ))}
          </ul>
        </div>
      )}
      <h4 className="text-lg font-bold text-blue-700 mt-6 mb-2">Ask a Question</h4>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAsk}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 transition"
        >
          Ask
        </button>
      </div>
      <div className="text-sm text-gray-600 mb-2">Quick questions? Ask here. For detailed session-based Q&amp;A, book a session above.</div>
      <div className="bg-blue-50 rounded-lg p-4 min-h-[60px]">
        {mentor.qa && mentor.qa.length === 0 ? (
          <div className="text-blue-700">No questions yet. Be the first to ask!</div>
        ) : (
          <ul className="space-y-2">
            {mentor.qa && mentor.qa.map((item, idx) => (
              <li key={idx} className="text-blue-900">
                <div>
                  <span className="font-bold">{item.user}:</span> {item.text}
                </div>
                {item.reply ? (
                  <div className="ml-4 mt-1 text-green-700 bg-green-50 rounded px-2 py-1 text-sm">
                    <span className="font-bold">Mentor reply:</span> {item.reply}
                  </div>
                ) : (
                  <div className="ml-4 mt-1">
                    <input
                      type="text"
                      value={replyInputs[idx] || ""}
                      onChange={e => setReplyInputs(inputs => ({ ...inputs, [idx]: e.target.value }))}
                      placeholder="Type mentor reply..."
                      className="px-2 py-1 rounded border border-green-200 text-sm mr-2"
                    />
                    <button
                      onClick={() => handleReply(idx)}
                      className="px-2 py-1 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
