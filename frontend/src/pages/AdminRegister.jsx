import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const [okMsg, setOkMsg] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setOkMsg('');
    if (!username || !password) return setError('Username and password required');
    if (password !== confirm) return setError('Passwords do not match');
    try {
      async function tryCall(url) {
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password, adminSecret }) });
        const ct = r.headers.get('content-type') || '';
        let d = null; if (ct.includes('application/json')) d = await r.json();
        return { r, d };
      }
      let res, data;
      ({ r: res, d: data } = await tryCall('/api/admin/register'));
      if (!data) ({ r: res, d: data } = await tryCall('http://localhost:5000/api/admin/register'));
      if (!data) throw new Error('Unexpected response');
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setOkMsg('Admin created. You can now login.');
      setTimeout(()=> navigate('/admin-login'), 800);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-purple-300/60">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-8 text-center tracking-tight">Admin Registration</h2>
        <div className="mb-4">
          <label className="block text-purple-900 font-semibold mb-2">Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/40 text-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-purple-900 font-semibold mb-2">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/40 text-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-purple-900 font-semibold mb-2">Confirm Password</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/40 text-lg" />
        </div>
        <div className="mb-6">
          <label className="block text-purple-900 font-semibold mb-2">Admin Secret (if configured)</label>
          <input value={adminSecret} onChange={e=>setAdminSecret(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50/40 text-lg" placeholder="Optional" />
        </div>
        {error && <div className="mb-3 text-red-600 text-sm font-semibold text-center">{error}</div>}
        {okMsg && <div className="mb-3 text-green-700 text-sm font-semibold text-center">{okMsg}</div>}
        <button type="submit" className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition">Create Admin</button>
      </form>
    </div>
  );
}
