import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-purple-300/60"
      >
        <h2 className="text-4xl font-extrabold text-purple-700 mb-8 text-center tracking-tight drop-shadow">
          {isCreating ? "Create Account" : "Student Login"}
        </h2>
        <div className="mb-6">
          <label className="block text-purple-900 font-semibold mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/40 text-lg"
            autoFocus
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-6">
          <label className="block text-purple-900 font-semibold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/40 text-lg"
            placeholder="Enter password"
          />
        </div>
        {isCreating && (
          <div className="mb-6">
            <label className="block text-purple-900 font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/40 text-lg"
              placeholder="Re-enter password"
            />
          </div>
        )}
        {error && <div className="mb-4 text-red-600 text-sm font-semibold text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition mb-3"
        >
          {isCreating ? "Create Account" : "Login & Take Quiz"}
        </button>
        <div className="flex justify-center">
          <button
            type="button"
            className="text-purple-700 underline font-semibold text-sm hover:text-purple-900"
            onClick={() => {
              setIsCreating(!isCreating);
              setError("");
              setUsername("");
              setPassword("");
              setConfirm("");
            }}
          >
            {isCreating ? "Back to Login" : "Create New Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
