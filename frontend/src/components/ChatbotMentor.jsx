import React, { useState } from "react";
import API from '../api/api';

const exampleResponses = {
  "web development": "Recommended course: Frontend Web Development (HTML, CSS, JavaScript, React)",
  "weekly learning plan": "Plan: Mon - Python, Tue - SQL, Wed - Machine Learning, Thu - Project, Fri - Review",
  "quiz python": "Q: What is a list in Python? A: A collection of items in a particular order."
};

export default function ChatbotMentor() {
  const [input, setInput] = useState("");
  const props = arguments[0] || {};
  const initialMessages = props.messages || [
    { sender: "bot", text: "Hi! Ask me about courses, learning plans, or quizzes." }
  ];
  const [messages, setMessages] = useState(initialMessages);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: "user", text: input }]);
    setLoading(true);
    setError("");
    try {
      // Call backend AI API
      const res = await API.post('/ai-response', {
        question: input
      });
      const answer = res.data?.answer || "";
      setMessages(prev => [...prev, { sender: "bot", text: answer }]);
    } catch (err) {
      setError("AI response failed. Showing example answer.");
      let response = "Sorry, I don't understand. Try asking about web development, weekly learning plan, or quiz python.";
      if (input.toLowerCase().includes("web development")) response = exampleResponses["web development"];
      if (input.toLowerCase().includes("weekly learning plan")) response = exampleResponses["weekly learning plan"];
      if (input.toLowerCase().includes("quiz") && input.toLowerCase().includes("python")) response = exampleResponses["quiz python"];
      setMessages(prev => [...prev, { sender: "bot", text: response }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col items-center w-full">
      <h3 className="text-lg font-bold text-blue-700 mb-2">AI Chatbot Mentor</h3>
      <div className="w-full max-w-md h-48 overflow-y-auto bg-white rounded-lg border border-blue-200 mb-4 p-3">
        {messages.length === 0 ? (
          <div className="text-blue-700">No messages yet.</div>
        ) : messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 text-sm ${msg.sender === "bot" ? "text-blue-700" : "text-blue-900 text-right"}`}>
            <span className="font-bold">{msg.sender === "bot" ? "Mentor" : "You"}:</span> {msg.text}
          </div>
        ))}
        {loading && (
          <div className="mb-2 text-sm text-blue-400 font-semibold">Mentor is typing...</div>
        )}
      </div>
      <div className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={e => e.key === "Enter" && !loading && handleSend()}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 transition"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
      {error && <div className="mt-2 text-red-600 text-sm font-semibold text-center">{error}</div>}
    </div>
  );
}
