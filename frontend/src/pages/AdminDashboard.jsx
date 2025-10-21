import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const info = JSON.parse(localStorage.getItem('student_logged_in') || 'null');
    if (!token || info?.role !== 'admin') {
      navigate('/admin-login');
      return;
    }
    async function load() {
      try {
        async function tryCall(url) {
          const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
          const ct = r.headers.get('content-type') || '';
          let d = null; if (ct.includes('application/json')) d = await r.json();
          return { r, d };
        }
        let res, data;
        ({ r: res, d: data } = await tryCall('/api/admin/users'));
        if (!data) ({ r: res, d: data } = await tryCall('http://localhost:5000/api/admin/users'));
        if (!data) throw new Error('Unexpected response');
        if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message || 'Failed to load');
      }
    }
    load();
  }, [navigate]);

  function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('student_logged_in');
    navigate('/admin-login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-purple-800">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <button onClick={()=>navigate('/admin-login')} className="px-3 py-1.5 rounded border border-purple-300 bg-white">Switch Account</button>
            <button onClick={logout} className="px-3 py-1.5 rounded border border-red-300 text-red-700 bg-white">Logout</button>
          </div>
        </div>
        {error && <div className="mb-4 text-red-700 bg-red-100 border border-red-300 rounded p-2">{error}</div>}
        <div className="rounded-2xl border border-purple-200 bg-white/70 backdrop-blur p-4">
          <h2 className="text-xl font-bold text-purple-700 mb-3">Users</h2>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-purple-900">
                  <th className="py-2 pr-4">Username</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.username} className="border-t border-purple-200/60">
                    <td className="py-2 pr-4 font-semibold">{u.username}</td>
                    <td className="py-2 pr-4"><span className="px-2 py-0.5 rounded-full border border-purple-300 text-purple-800 bg-white text-xs">{u.role || 'user'}</span></td>
                    <td className="py-2 pr-4">{u.email || '—'}</td>
                    <td className="py-2 pr-4">{u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td className="py-3 text-purple-700" colSpan={4}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
