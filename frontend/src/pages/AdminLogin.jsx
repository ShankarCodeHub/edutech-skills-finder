import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      async function tryCall(url) {
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const ct = r.headers.get('content-type') || '';
        let d = null;
        if (ct.includes('application/json')) d = await r.json();
        return { r, d };
      }
      let res, data;
      ({ r: res, d: data } = await tryCall('/api/admin/login'));
      if (!data) ({ r: res, d: data } = await tryCall('http://localhost:5000/api/admin/login'));
      if (!data) throw new Error('Unexpected response');
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('student_logged_in', JSON.stringify({ username: data.username, role: data.role }));
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-purple-300/60">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-8 text-center tracking-tight">Admin Login</h2>
        <div className="mb-6">
          <label className="block text-purple-900 font-semibold mb-2">Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/40 text-lg" />
        </div>
        <div className="mb-6">
          <label className="block text-purple-900 font-semibold mb-2">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/40 text-lg" />
        </div>
        {error && <div className="mb-4 text-red-600 text-sm font-semibold text-center">{error}</div>}
        <button type="submit" className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition">Login</button>
      </form>
    </div>
  );
}
