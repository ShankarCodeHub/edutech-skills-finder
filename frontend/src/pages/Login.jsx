import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Show message from redirect if available
  const redirectMessage = location.state?.message;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    if (isCreating) {
      if (password.length < 4) {
        setError("Password must be at least 4 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
      try {
        let res, data;
        async function tryCall(url) {
          const r = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const ct = r.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const d = await r.json();
            return { r, d };
          }
          return { r, d: null };
        }
        // First try proxy, then direct backend if not JSON
        ({ r: res, d: data } = await tryCall('/api/register'));
        if (!data) {
          ({ r: res, d: data } = await tryCall('http://localhost:5000/api/register'));
        }
        if (!data) {
          const txt = await res.text();
          throw new Error(txt?.startsWith('<!DOCTYPE') ? 'Backend not reachable (got HTML). Is the backend running on port 5000 and proxy set?' : (txt || 'Unexpected response'));
        }
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        setError("");
        setIsCreating(false);
        setUsername("");
        setPassword("");
        setConfirm("");
        alert("Account created! Please login.");
        return;
      } catch (err) {
        setError(err.message || 'Registration failed');
        return;
      }
    }
    // Login flow against backend
    try {
      let res, data;
      async function tryCall(url) {
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const ct = r.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const d = await r.json();
          return { r, d };
        }
        return { r, d: null };
      }
      ({ r: res, d: data } = await tryCall('/api/login'));
      if (!data) {
        ({ r: res, d: data } = await tryCall('http://localhost:5000/api/login'));
      }
      if (!data) {
        const txt = await res.text();
        throw new Error(txt?.startsWith('<!DOCTYPE') ? 'Backend not reachable (got HTML). Is the backend running on port 5000 and proxy set?' : (txt || 'Unexpected response'));
      }
      if (!res.ok) throw new Error(data.error || 'Login failed');
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('student_logged_in', JSON.stringify({ username: data.username, role: data.role || 'user' }));
      setError("");
      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-50 p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Info Card */}
        <div className="hidden lg:block bg-gradient-to-br from-purple-700 to-purple-500 rounded-3xl p-10 text-white shadow-2xl">
          <div className="mb-6">
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome to<br/>EduTech Skills Finder 🎓</h1>
            <p className="text-purple-100 text-lg leading-relaxed">
              Discover your true potential with AI-powered skill assessments, personalized learning paths, and expert mentor guidance.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">AI-Powered Assessments</h3>
                <p className="text-purple-100 text-sm">Take smart quizzes and get instant skill analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Track Your Progress</h3>
                <p className="text-purple-100 text-sm">Visualize your learning journey with detailed analytics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Connect with Mentors</h3>
                <p className="text-purple-100 text-sm">Book 1-on-1 sessions with industry experts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-purple-300/60"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-700 mb-2 tracking-tight">
              {isCreating ? "Create Account" : "Student Login"}
            </h2>
            <p className="text-purple-600 text-sm">
              {isCreating ? "Join thousands of learners today" : "Access your personalized dashboard"}
            </p>
            {redirectMessage && (
              <div className="mt-3 p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
                {redirectMessage}
              </div>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-purple-900 font-semibold mb-2 text-sm">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-purple-50/40 text-base transition"
              autoFocus
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-5">
            <label className="block text-purple-900 font-semibold mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-purple-50/40 text-base transition"
              placeholder="Enter your password"
            />
          </div>
          {isCreating && (
            <div className="mb-5">
              <label className="block text-purple-900 font-semibold mb-2 text-sm">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-purple-50/40 text-base transition"
                placeholder="Re-enter password"
              />
            </div>
          )}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 mb-4"
          >
            {isCreating ? "Create Account & Start Learning" : "Login & Access Dashboard"}
          </button>
          <div className="text-center">
            <button
              type="button"
              className="text-purple-700 underline font-semibold text-sm hover:text-purple-900 transition"
              onClick={() => {
                setIsCreating(!isCreating);
                setError("");
                setUsername("");
                setPassword("");
                setConfirm("");
              }}
            >
              {isCreating ? "Already have an account? Login" : "New student? Create Account"}
            </button>
          </div>
          
          {/* Mobile-only benefits */}
          <div className="lg:hidden mt-6 pt-6 border-t border-purple-200 space-y-3">
            <div className="flex items-center gap-2 text-purple-700">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">AI-powered skill assessments</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm">Track your progress</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm">Connect with expert mentors</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
