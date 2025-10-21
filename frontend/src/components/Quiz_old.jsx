import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaTimes, FaQuestionCircle, FaBrain, FaDatabase, FaPython, FaCheckCircle } from "react-icons/fa";

const INTEREST_OPTIONS = [
  'AI', 'Web Development', 'Data Science', 'Cybersecurity', 'Mobile Apps', 'Cloud', 'DevOps', 'UI/UX', 'Blockchain'
];

// 10 questions per interest/skill
const INTEREST_QUESTIONS = {
  'AI': [
    { key: "ai_q1", label: "What excites you most about AI?", options: ["Natural Language Processing", "Computer Vision", "Reinforcement Learning", "General AI research"] },
    { key: "ai_q2", label: "Your experience with AI projects?", options: ["Extensive", "Some projects", "Just learning", "None"] },
    { key: "ai_q3", label: "Preferred AI framework?", options: ["TensorFlow", "PyTorch", "Keras", "Hugging Face"] },
    { key: "ai_q4", label: "Interest in deep learning?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "ai_q5", label: "Comfortable with neural networks?", options: ["Expert", "Intermediate", "Beginner", "Not yet"] },
    { key: "ai_q6", label: "Which AI application area?", options: ["Chatbots/NLP", "Image recognition", "Recommendation systems", "Autonomous systems"] },
    { key: "ai_q7", label: "Familiarity with transformers?", options: ["Very familiar", "Somewhat", "Heard of it", "New to me"] },
    { key: "ai_q8", label: "Interest in AI ethics?", options: ["High", "Medium", "Low", "Not considered"] },
    { key: "ai_q9", label: "Preferred AI project scale?", options: ["Research papers", "Small experiments", "Production systems", "Enterprise solutions"] },
    { key: "ai_q10", label: "Time spent on AI weekly?", options: ["10+ hours", "5-10 hours", "2-5 hours", "< 2 hours"] },
  ],
  'Web Development': [
    { key: "web_q1", label: "Frontend or backend focus?", options: ["Frontend", "Backend", "Full-stack", "Not sure"] },
    { key: "web_q2", label: "Preferred frontend framework?", options: ["React", "Vue", "Angular", "Vanilla JS"] },
    { key: "web_q3", label: "Backend language preference?", options: ["Node.js", "Python", "Java", "PHP"] },
    { key: "web_q4", label: "Experience with databases?", options: ["Advanced", "Intermediate", "Basic", "None"] },
    { key: "web_q5", label: "Interest in responsive design?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "web_q6", label: "Comfort with APIs (REST/GraphQL)?", options: ["Expert", "Comfortable", "Learning", "Beginner"] },
    { key: "web_q7", label: "Deployment experience?", options: ["Extensive", "Some", "Limited", "None"] },
    { key: "web_q8", label: "Interest in web performance?", options: ["High", "Medium", "Low", "Not a priority"] },
    { key: "web_q9", label: "Preferred project type?", options: ["E-commerce", "Social media", "Dashboards", "Portfolios"] },
    { key: "web_q10", label: "Time on web dev weekly?", options: ["10+ hours", "5-10 hours", "2-5 hours", "< 2 hours"] },
  ],
  'Data Science': [
    { key: "ds_q1", label: "Area of interest?", options: ["Data analysis", "Data visualization", "Predictive modeling", "Big data"] },
    { key: "ds_q2", label: "Python data stack comfort?", options: ["Expert", "Intermediate", "Beginner", "None"] },
    { key: "ds_q3", label: "Preferred visualization tool?", options: ["Matplotlib", "Seaborn", "Plotly", "Tableau"] },
    { key: "ds_q4", label: "Statistics knowledge?", options: ["Strong", "Good", "Basic", "Needs work"] },
    { key: "ds_q5", label: "Experience with ML models?", options: ["Extensive", "Some", "Limited", "None"] },
    { key: "ds_q6", label: "Interest in feature engineering?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "ds_q7", label: "Comfortable with SQL?", options: ["Expert", "Intermediate", "Beginner", "Learning"] },
    { key: "ds_q8", label: "Preferred data source?", options: ["APIs", "Databases", "CSV/Excel", "Web scraping"] },
    { key: "ds_q9", label: "Interest in storytelling with data?", options: ["High", "Medium", "Low", "Not important"] },
    { key: "ds_q10", label: "Time on DS weekly?", options: ["10+ hours", "5-10 hours", "2-5 hours", "< 2 hours"] },
  ],
  'Cybersecurity': [
    { key: "cyber_q1", label: "Primary interest?", options: ["Penetration testing", "Network security", "Application security", "Cryptography"] },
    { key: "cyber_q2", label: "Experience with security tools?", options: ["Advanced", "Intermediate", "Beginner", "None"] },
    { key: "cyber_q3", label: "Interest in ethical hacking?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "cyber_q4", label: "Comfort with Linux?", options: ["Expert", "Comfortable", "Learning", "Beginner"] },
    { key: "cyber_q5", label: "Knowledge of OWASP Top 10?", options: ["Expert", "Good", "Basic", "New to me"] },
    { key: "cyber_q6", label: "Interest in security certifications?", options: ["Pursuing", "Planning to", "Maybe", "Not interested"] },
    { key: "cyber_q7", label: "Scripting skills?", options: ["Advanced", "Intermediate", "Basic", "None"] },
    { key: "cyber_q8", label: "Interest in incident response?", options: ["High", "Medium", "Low", "Not sure"] },
    { key: "cyber_q9", label: "Preferred learning method?", options: ["CTF challenges", "Labs/courses", "Bug bounties", "Reading"] },
    { key: "cyber_q10", label: "Time on security weekly?", options: ["10+ hours", "5-10 hours", "2-5 hours", "< 2 hours"] },
  ],
  'Mobile Apps': [
    { key: "mobile_q1", label: "Platform preference?", options: ["iOS", "Android", "Cross-platform", "Both native"] },
    { key: "mobile_q2", label: "Preferred framework?", options: ["React Native", "Flutter", "Swift/Kotlin", "Xamarin"] },
    { key: "mobile_q3", label: "Experience level?", options: ["Advanced", "Intermediate", "Beginner", "None"] },
    { key: "mobile_q4", label: "Interest in UI/UX?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "mobile_q5", label: "Backend integration comfort?", options: ["Expert", "Comfortable", "Learning", "Beginner"] },
    { key: "mobile_q6", label: "Interest in app performance?", options: ["High", "Medium", "Low", "Not a priority"] },
    { key: "mobile_q7", label: "Preferred app type?", options: ["Social", "Productivity", "Games", "E-commerce"] },
    { key: "mobile_q8", label: "Experience with app stores?", options: ["Published apps", "In progress", "Planning", "None"] },
    { key: "mobile_q9", label: "Interest in AR/VR?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "mobile_q10", label: "Time on mobile dev weekly?", options: ["10+ hours", "5-10 hours", "2-5 hours", "< 2 hours"] },
  ],
  'Cloud': [
    { key: "cloud_q1", label: "Preferred cloud provider?", options: ["AWS", "Azure", "Google Cloud", "Multi-cloud"] },
    { key: "cloud_q2", label: "Experience level?", options: ["Advanced", "Intermediate", "Beginner", "None"] },
    { key: "cloud_q3", label: "Interest in serverless?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "cloud_q4", label: "Comfortable with IaaS/PaaS/SaaS?", options: ["Expert", "Good understanding", "Basic", "Learning"] },
    { key: "cloud_q5", label: "Interest in cloud security?", options: ["High", "Medium", "Low", "Not a priority"] },
    { key: "cloud_q6", label: "Experience with containers?", options: ["Advanced", "Intermediate", "Beginner", "None"] },
    { key: "cloud_q7", label: "Interest in cost optimization?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "cloud_q8", label: "Preferred deployment method?", options: ["CI/CD pipelines", "Manual", "Hybrid", "Not sure"] },
    { key: "cloud_q9", label: "Interest in cloud certifications?", options: ["Pursuing", "Planning to", "Maybe", "Not interested"] },
    { key: "cloud_q10", label: "Time on cloud weekly?", options: ["10+ hours", "5-10 hours", "2-5 hours", "< 2 hours"] },
  ],
  'DevOps': [
    { key: "devops_q1", label: "Primary interest?", options: ["CI/CD", "Infrastructure as Code", "Monitoring", "Automation"] },
    { key: "devops_q2", label: "Experience with Docker?", options: ["Expert", "Intermediate", "Beginner", "None"] },
    { key: "devops_q3", label: "Kubernetes knowledge?", options: ["Advanced", "Good", "Basic", "New to me"] },
    { key: "devops_q4", label: "Preferred CI/CD tool?", options: ["Jenkins", "GitLab CI", "GitHub Actions", "CircleCI"] },
    { key: "devops_q5", label: "Interest in IaC tools?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "devops_q6", label: "Scripting comfort?", options: ["Expert", "Comfortable", "Learning", "Beginner"] },
    { key: "devops_q7", label: "Experience with monitoring tools?", options: ["Advanced", "Intermediate", "Basic", "None"] },
    { key: "devops_q8", label: "Interest in GitOps?", options: ["High", "Medium", "Low", "Not familiar"] },
    { key: "devops_q9", label: "Preferred cloud platform?", options: ["AWS", "Azure", "GCP", "On-premise"] },
    { key: "devops_q10", label: "Time on DevOps weekly?", options: ["10+ hours", "5-10 hours", "2-5 hours", "< 2 hours"] },
  ],
  'UI/UX': [
    { key: "uiux_q1", label: "Primary focus?", options: ["UI design", "UX research", "Both equally", "Prototyping"] },
    { key: "uiux_q2", label: "Preferred design tool?", options: ["Figma", "Adobe XD", "Sketch", "InVision"] },
    { key: "uiux_q3", label: "Experience level?", options: ["Advanced", "Intermediate", "Beginner", "None"] },
    { key: "uiux_q4", label: "Interest in user research?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "uiux_q5", label: "Comfort with design systems?", options: ["Expert", "Comfortable", "Learning", "Beginner"] },
    { key: "uiux_q6", label: "Interest in accessibility?", options: ["High", "Medium", "Low", "Not a priority"] },
    { key: "uiux_q7", label: "Preferred project type?", options: ["Mobile apps", "Web apps", "Desktop", "All platforms"] },
    { key: "uiux_q8", label: "Experience with usability testing?", options: ["Extensive", "Some", "Limited", "None"] },
    { key: "uiux_q9", label: "Interest in motion design?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "uiux_q10", label: "Time on UI/UX weekly?", options: ["10+ hours", "5-10 hours", "2-5 hours", "< 2 hours"] },
  ],
  'Blockchain': [
    { key: "bc_q1", label: "Primary interest?", options: ["Smart contracts", "DApps", "Cryptocurrency", "NFTs"] },
    { key: "bc_q2", label: "Preferred blockchain?", options: ["Ethereum", "Solana", "Polygon", "Bitcoin"] },
    { key: "bc_q3", label: "Experience with Solidity?", options: ["Advanced", "Intermediate", "Beginner", "None"] },
    { key: "bc_q4", label: "Interest in Web3?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "bc_q5", label: "Comfort with cryptography?", options: ["Expert", "Good", "Basic", "Learning"] },
    { key: "bc_q6", label: "Interest in DeFi?", options: ["Very high", "High", "Moderate", "Low"] },
    { key: "bc_q7", label: "Experience with wallets/transactions?", options: ["Extensive", "Some", "Limited", "None"] },
    { key: "bc_q8", label: "Interest in blockchain security?", options: ["High", "Medium", "Low", "Not a priority"] },
    { key: "bc_q9", label: "Preferred development environment?", options: ["Remix", "Hardhat", "Truffle", "Foundry"] },
    { key: "bc_q10", label: "Time on blockchain weekly?", options: ["10+ hours", "5-10 hours", "2-5 hours", "< 2 hours"] },
  ],
};

const COMMON_QUESTIONS = [
  {
    key: "exp_lvl",
    label: "What is your current experience level?",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    key: "time_commit",
    label: "How much time can you commit every week?",
    options: ["< 3 hrs/week", "3-6 hrs/week", "> 6 hrs/week"],
  },
  {
    key: "interests_multi",
    label: "Select your interests/skills (choose one or more)",
    options: INTEREST_OPTIONS,
  },
];

const SUBJECT_DESCRIPTIONS = {
  Python: "Learn powerful scripting, web development, and data handling using Python.",
  SQL: "Master database queries, reporting, and business intelligence skills.",
  "Machine Learning": "Dive into predictive analytics, model training, and AI solutions.",
};

export default function Quiz({ isOpen, onClose, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [subjectFocus, setSubjectFocus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const qEls = useRef({});

  const subjectQuestions = useMemo(
    () => (subjectFocus ? SUBJECT_QUESTIONS[subjectFocus] : []),
    [subjectFocus]
  );
  const questions = useMemo(
    () => [...subjectQuestions, ...COMMON_QUESTIONS],
    [subjectQuestions]
  );
  const allAnswered = subjectFocus && questions.every((q) => {
    if (q.key === 'interests_multi') {
      const v = answers[q.key];
      return Array.isArray(v) && v.length > 0;
    }
    return !!answers[q.key];
  });
  const answeredCount = useMemo(
    () => questions.filter((q) => {
      if (q.key === 'interests_multi') {
        const v = answers[q.key];
        return Array.isArray(v) && v.length > 0;
      }
      return !!answers[q.key];
    }).length,
    [questions, answers]
  );
  const progressPct = useMemo(
    () => (questions.length ? Math.round((answeredCount / questions.length) * 100) : 0),
    [answeredCount, questions]
  );

  // Persist and restore quiz state
  useEffect(() => {
    if (!isOpen) return;
    try {
      const raw = localStorage.getItem("quiz_state");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if (parsed.subjectFocus) setSubjectFocus(parsed.subjectFocus);
          if (parsed.answers) setAnswers(parsed.answers);
        }
      }
    } catch {}
    // reset timer on open
    setTimeLeft(600);
  }, [isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem("quiz_state", JSON.stringify({ subjectFocus, answers }));
    } catch {}
  }, [subjectFocus, answers]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isOpen, timeLeft]);

  // Keep active index within range and auto-focus first unanswered
  useEffect(() => {
    if (!questions.length) return;
    let idx = Math.min(activeIndex, questions.length - 1);
    const firstUnanswered = questions.findIndex((q) => !answers[q.key]);
    if (firstUnanswered !== -1) idx = Math.min(idx, firstUnanswered);
    setActiveIndex(idx);
    const key = questions[idx]?.key;
    const el = key ? qEls.current[key] : null;
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length]);

  const gotoIndex = useCallback((idx) => {
    if (!questions.length) return;
    const clamped = Math.max(0, Math.min(idx, questions.length - 1));
    setActiveIndex(clamped);
    const key = questions[clamped]?.key;
    const el = key ? qEls.current[key] : null;
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [questions]);

  const submit = useCallback(async (allowPartial = false) => {
    if (!allAnswered && !allowPartial) {
      setError("Please answer all questions.");
      return;
    }
    setError("");
    setSubmitting(true);
    let triedDirect = false;
    try {
      let res, data;
      try {
        const token = localStorage.getItem('auth_token');
        res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ answers, subjectFocus }),
        });
      } catch (err) {
        // Network error, try direct backend URL as fallback
        triedDirect = true;
        const token = localStorage.getItem('auth_token');
        res = await fetch("http://localhost:5000/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ answers, subjectFocus }),
        });
      }
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text?.startsWith("<!DOCTYPE") ?
          (triedDirect
            ? "Backend not reachable at http://localhost:5000/api/quiz (got HTML). Is the server running on port 5000?"
            : "Backend not reachable at /api/quiz (got HTML). Is the proxy set in package.json and is the backend running?")
          : (text || "Unexpected response from server."));
      }
      if (!res.ok) throw new Error(data.error || "Quiz submit failed");
      onComplete?.(data);
      onClose?.();
    } catch (e) {
      setError(e.message || "Something went wrong. Please check that both frontend and backend servers are running, and that the proxy is set in package.json.");
    } finally {
      setSubmitting(false);
    }
  }, [allAnswered, answers, subjectFocus, onComplete, onClose]);

  // Auto-submit on timeout (allow partial answers)
  useEffect(() => {
    if (!isOpen) return;
    if (timeLeft === 0 && !submitting) {
      submit(true);
    }
  }, [isOpen, timeLeft, submitting, submit]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        gotoIndex(activeIndex + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        gotoIndex(activeIndex - 1);
      } else if (e.key === "Enter") {
        if (allAnswered && !submitting) {
          e.preventDefault();
          submit();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, activeIndex, allAnswered, submitting, gotoIndex, onClose, submit]);

  return !isOpen ? null : (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-purple-200/60 bg-white/70 backdrop-blur-xl shadow-2xl">
        {/* Top progress bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-purple-100">
          <div
            className="h-1 bg-gradient-to-r from-purple-600 via-purple-600 to-purple-500 transition-[width] duration-500 relative"
            style={{ width: `${progressPct}%` }}
          >
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.35)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.35)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-progress" />
          </div>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">
                <span className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 bg-clip-text text-transparent">Skill Fit Quiz</span>
              </h3>
              <p className="text-sm text-purple-700/80 mt-1">
                Answer {questions.length} quick questions. {answeredCount}/{questions.length} answered
              </p>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-purple-300/60 bg-white/70 text-purple-800 hover:text-red-600 shadow-sm"
              aria-label="Close quiz"
            >
              <FaTimes aria-hidden="true" />
            </button>
          </div>

          {/* Timer */}
          <div className="mb-4 flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50/60 px-3 py-2 text-purple-900">
            <div className="text-sm">Time remaining</div>
            <div className={`font-extrabold tabular-nums ${timeLeft <= 60 ? 'text-red-600' : 'text-purple-900'}`} aria-live="polite">
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          </div>

          {/* Subject picker */}
          <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="font-semibold text-purple-900 mb-2 block select-none">Choose a subject focus</label>
              <div className="relative">
                <select
                  value={subjectFocus}
                  onChange={(e) => {
                    setSubjectFocus(e.target.value);
                    setAnswers({});
                  }}
                  className="w-full appearance-none border border-purple-300/70 rounded-lg px-3 py-2 text-purple-900 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm hover:shadow-md transition"
                >
                  <option value="">-- Select --</option>
                  <option value="Python">Python</option>
                  <option value="SQL">SQL</option>
                  <option value="Machine Learning">Machine Learning</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-700">▾</span>
              </div>
            </div>
            <p className="rounded-lg border border-purple-200 bg-purple-50/70 p-3 text-sm text-purple-800 min-h-[48px] select-none flex items-start gap-2">
              {subjectFocus === "Python" && <FaPython className="mt-0.5" aria-hidden="true" />}
              {subjectFocus === "SQL" && <FaDatabase className="mt-0.5" aria-hidden="true" />}
              {subjectFocus === "Machine Learning" && <FaBrain className="mt-0.5" aria-hidden="true" />}
              <span>
                {subjectFocus
                  ? SUBJECT_DESCRIPTIONS[subjectFocus]
                  : "This helps tailor your recommendations to your interest area."}
              </span>
            </p>
          </div>

          {/* Step dots */}
          {questions.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {questions.map((q, idx) => {
                const filled = !!answers[q.key];
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={q.key}
                    type="button"
                    onClick={() => gotoIndex(idx)}
                    className={`h-3 w-3 rounded-full transition-all ${
                      isActive
                        ? "ring-2 ring-purple-600 bg-purple-600"
                        : filled
                        ? "bg-purple-500/90"
                        : "bg-purple-300/70 hover:bg-purple-400"
                    }`}
                    aria-label={`Go to question ${idx + 1}`}
                    title={`Question ${idx + 1}`}
                  />
                );
              })}
              <span className="ml-2 text-xs text-purple-700/80">
                {answeredCount}/{questions.length} answered
              </span>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-5 max-h-[55vh] overflow-auto pr-2 scroll-smooth">
            {questions.map((q, idx) => (
              <div
                key={q.key}
                ref={(el) => (qEls.current[q.key] = el)}
                className="rounded-xl border border-purple-200 bg-white/70 p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 font-semibold text-purple-900 mb-3 text-lg">
                  <FaQuestionCircle className="text-purple-700" aria-hidden="true" />
                  {`${idx + 1}. ${q.label}`}
                </div>
                {q.key === 'interests_multi' ? (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => {
                      const arr = Array.isArray(answers[q.key]) ? answers[q.key] : [];
                      const selected = arr.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setAnswers(prev => {
                            const current = Array.isArray(prev[q.key]) ? prev[q.key] : [];
                            const next = selected ? current.filter(x => x !== opt) : [...current, opt];
                            return { ...prev, [q.key]: next };
                          })}
                          className={`px-3 py-1.5 rounded-full border text-sm font-semibold ${selected ? 'bg-purple-600 text-white border-purple-600' : 'bg-white/80 text-purple-900 border-purple-300 hover:bg-purple-50'}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt) => {
                      const selected = answers[q.key] === opt;
                      return (
                        <label
                          key={opt}
                          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 cursor-pointer transition-all ${
                            selected
                              ? "bg-gradient-to-r from-purple-600 to-purple-500 border-purple-700 text-white shadow-md"
                              : "bg-white/80 border-purple-300 text-purple-900 hover:border-purple-600 hover:bg-purple-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.key}
                            value={opt}
                            checked={selected}
                            onChange={() => setAnswers((prev) => ({ ...prev, [q.key]: opt }))}
                            className="hidden"
                          />
                          {selected ? (
                            <FaCheckCircle className="text-white" aria-hidden="true" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-purple-500" />
                          )}
                          <span className="font-medium">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          <div aria-live="polite">
            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded select-none">
                {error}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => gotoIndex(activeIndex - 1)}
                disabled={activeIndex <= 0}
                className="px-4 py-2 rounded-lg border border-purple-300 text-purple-800 hover:bg-purple-50 transition disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => gotoIndex(activeIndex + 1)}
                disabled={activeIndex >= questions.length - 1}
                className="px-4 py-2 rounded-lg border border-purple-300 text-purple-800 hover:bg-purple-50 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-purple-300 text-purple-800 hover:bg-purple-50 transition select-none"
            >
              Cancel
            </button>
            <button
              disabled={!allAnswered || submitting}
              onClick={submit}
              className="group relative inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-700/30 transition disabled:opacity-75 disabled:cursor-not-allowed select-none"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
              <span className="pointer-events-none absolute left-[-150%] top-0 h-full w-1/2 bg-gradient-to-r from-white/0 via-white/60 to-white/0 opacity-40 blur-md animate-shine" />
            </button>
          </div>
        </div>
      </div>

      {/* Local keyframes for shine/progress */}
      <style>{`
        @keyframes shine-slide { 0% { transform: translateX(-150%);} 100% { transform: translateX(250%);} }
        .animate-shine { animation: shine-slide 2.2s linear infinite; }
        @keyframes progress-stripes { 0% { background-position: 0 0; } 100% { background-position: 24px 24px; } }
        .animate-progress { animation: progress-stripes 1.2s linear infinite; }
      `}</style>
    </div>
  );
}
