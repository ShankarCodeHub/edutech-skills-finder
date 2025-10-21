import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from '../api/api';

export default function MentorSession() {
  const { mentorId, sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [replyInputs, setReplyInputs] = useState({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    API.get(`/mentors/${mentorId}/session/${sessionId}`)
      .then(res => { if (mounted) setSession(res.data); })
      .catch(() => { if (mounted) setSession(null); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [mentorId, sessionId]);

  const fetchSession = () => {
    setLoading(true);
    API.get(`/mentors/${mentorId}/session/${sessionId}`)
      .then(res => setSession(res.data))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  };

  async function handleAsk() {
    if (!question.trim()) return;
    try {
      await API.post(`/mentors/${mentorId}/session/${sessionId}/question`, { text: question });
      setQuestion("");
      fetchSession();
    } catch {
      alert("Failed to submit question.");
    }
  }

  async function handleReply(idx) {
    const reply = replyInputs[idx];
    if (!reply || !reply.trim()) return;
    try {
      await API.post(`/mentors/${mentorId}/session/${sessionId}/reply`, { index: idx, reply });
      setReplyInputs(inputs => ({ ...inputs, [idx]: "" }));
      fetchSession();
    } catch {
      alert("Failed to submit reply.");
    }
  }

  if (loading) return <div className="p-8 text-center text-blue-700">Loading session...</div>;
  if (!session) return <div className="p-8 text-center text-red-600 font-bold">Session not found.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
      <div className="mb-4">
        <div className="text-2xl font-bold text-blue-900">Session: {session.topic}</div>
        <div className="text-blue-600 font-semibold">Date: {session.date}</div>
        <div className="text-gray-500 text-sm mt-1">Booked by: {session.user}</div>
      </div>
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
      <div className="bg-blue-50 rounded-lg p-4 min-h-[60px]">
        {session.qa && session.qa.length === 0 ? (
          <div className="text-blue-700">No questions yet. Be the first to ask!</div>
        ) : (
          <ul className="space-y-2">
            {session.qa && session.qa.map((item, idx) => (
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
