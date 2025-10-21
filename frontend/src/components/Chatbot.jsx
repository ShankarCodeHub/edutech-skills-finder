import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPaperPlane, FaRobot, FaUserCircle, FaSpinner } from "react-icons/fa";

const initialMessages = [
  { from: "user", text: "What skills do I need for Data Science?" },
  { from: "ai", text: "You should focus on Python, statistics, machine learning, and data visualization." },
];

export default function Chatbot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [typing, setTyping] = useState(false);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // UPDATED: Sends input to backend API and displays AI response
  const sendMessage = async () => {
    if (!input.trim()) return;
    const content = input;
    setMessages(prev => [...prev, { from: "user", text: content }]);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch("/api/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: content }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { from: "ai", text: data.answer }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { from: "ai", text: "Sorry, I couldn't get a response. Try again later." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <section
      id="chatbot"
      className="relative mx-auto w-full max-w-5xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl rounded-3xl border-2 border-purple-200/60 bg-white/60 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col"
      style={{ minHeight: '60vh' }}
    >
      {/* Animated background blobs for extra stunning look */}
      <div className="pointer-events-none absolute -inset-16 -z-10">
        <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-purple-400/40 blur-[90px] animate-blob" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-300/40 blur-[90px] animate-blob delay-2000" />
      </div>
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-purple-400/25 via-purple-300/15 to-purple-500/25 blur-2xl" />
      {/* Header */}
  <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-purple-200/60 bg-white/70 px-4 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-md shadow-purple-600/30">
          <FaRobot aria-hidden="true" />
        </span>
        <h2 className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 bg-clip-text text-transparent text-lg font-extrabold">AI Chatbot Mentor</h2>
        <span className="ml-auto text-xs text-purple-700/80">Powered by your backend</span>
      </div>

      {/* Messages */}
  <div className="flex-1 min-h-[18rem] sm:min-h-[24rem] md:min-h-[28rem] lg:min-h-[32rem] overflow-y-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-3 scroll-smooth">
        {messages.map((msg, i) => {
          const isUser = msg.from === "user";
          return (
            <div
              key={i}
              className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="shrink-0 text-purple-700"><FaRobot className="h-6 w-6" aria-hidden="true" /></div>
              )}
              <div
                className={`max-w-[80vw] sm:max-w-[70%] md:max-w-[60%] rounded-2xl px-4 py-2 text-sm shadow transition-all duration-300 ${
                  isUser
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-br-lg hover:scale-105"
                    : "bg-white/80 border border-purple-200 text-purple-900 rounded-bl-lg hover:scale-105"
                }`}
                style={{ wordBreak: 'break-word', fontSize: '1rem' }}
              >
                {msg.text}
              </div>
              {isUser && (
                <div className="shrink-0 text-purple-700"><FaUserCircle className="h-6 w-6" aria-hidden="true" /></div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-center gap-2 text-purple-700">
            <FaRobot className="h-5 w-5" aria-hidden="true" />
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:0.3s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 sm:gap-3 border-t border-purple-200/60 bg-white/70 px-2 sm:px-4 py-3 sm:py-4">
        <input
          type="text"
          className="flex-grow rounded-2xl border border-purple-300/70 bg-white/80 px-3 sm:px-5 py-2 sm:py-3 text-purple-900 placeholder-purple-400 outline-none focus:ring-2 focus:ring-purple-600 shadow-sm text-base"
          placeholder="Ask anything about skills, courses, or roadmaps..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          aria-label="Send Message"
          className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 px-4 sm:px-5 py-2 sm:py-3 text-base font-semibold text-white shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-700/30 focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <FaPaperPlane className="transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          <span className="hidden sm:inline">Send</span>
          <span className="pointer-events-none absolute left-[-150%] top-0 h-full w-1/2 bg-gradient-to-r from-white/0 via-white/60 to-white/0 opacity-40 blur-md animate-shine" />
        </button>
      </div>

      {/* Local keyframes for shine and blobs */}
      <style>{`
        @keyframes shine-slide { 0% { transform: translateX(-150%);} 100% { transform: translateX(250%);} }
        .animate-shine { animation: shine-slide 2.2s linear infinite; }
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.08); }
          66% { transform: translate(-20px, 25px) scale(0.95); }
        }
        .animate-blob { animation: blob 9s ease-in-out infinite; }
        .delay-2000 { animation-delay: 2s; }
      `}</style>
    </section>
  );
}
