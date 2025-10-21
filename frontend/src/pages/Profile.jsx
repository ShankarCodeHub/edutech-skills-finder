import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INTEREST_OPTIONS = [
  'AI', 'Web Development', 'Data Science', 'Cybersecurity', 'Mobile Apps', 'Cloud', 'DevOps', 'UI/UX', 'Blockchain'
];

export default function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    fullName: '',
    email: '',
    branchYear: '',
    college: '',
    phone: '',
    interests: [],
    location: '',
    bio: '',
    avatarUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const token = useMemo(() => localStorage.getItem('auth_token'), []);

  useEffect(() => {
    async function load() {
      if (!token) {
        navigate('/login');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } });
        const ct = res.headers.get('content-type') || '';
        let data = null;
        if (ct.includes('application/json')) data = await res.json();
        if (!data) {
          const res2 = await fetch('http://localhost:5000/api/profile', { headers: { Authorization: `Bearer ${token}` } });
          if ((res2.headers.get('content-type')||'').includes('application/json')) data = await res2.json();
        }
        if (!data) throw new Error('Backend not reachable.');
        if (!res.ok && data.error) throw new Error(data.error);
        setProfile(p => ({ ...p, ...data }));
      } catch (e) {
        setError(e.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, navigate]);

  async function saveProfile(e) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError('');
    setMsg('');
    const payload = {
      fullName: profile.fullName,
      email: profile.email,
      branchYear: profile.branchYear,
      college: profile.college,
      phone: profile.phone,
      interests: profile.interests,
      location: profile.location,
      bio: profile.bio,
    };
    try {
      let res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      let data = null;
      if ((res.headers.get('content-type')||'').includes('application/json')) data = await res.json();
      if (!data) {
        const res2 = await fetch('http://localhost:5000/api/profile', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload)
        });
        if ((res2.headers.get('content-type')||'').includes('application/json')) data = await res2.json();
        res = res2;
      }
      if (!data) throw new Error('Backend not reachable.');
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setProfile(p => ({ ...p, ...data }));
      setMsg('Profile updated');
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(e) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setSaving(true);
    setError('');
    setMsg('');
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      let res = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      let data = null;
      if ((res.headers.get('content-type')||'').includes('application/json')) data = await res.json();
      if (!data) {
        const res2 = await fetch('http://localhost:5000/api/profile/avatar', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
        if ((res2.headers.get('content-type')||'').includes('application/json')) data = await res2.json();
        res = res2;
      }
      if (!data) throw new Error('Backend not reachable.');
      if (!res.ok) throw new Error(data.error || 'Failed to upload');
      setProfile(p => ({ ...p, ...data }));
      setMsg('Avatar updated');
    } catch (e) {
      setError(e.message || 'Failed to upload');
    } finally {
      setSaving(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function toggleInterest(val) {
    setProfile(p => {
      const exists = p.interests.includes(val);
      const interests = exists ? p.interests.filter(x => x !== val) : [...p.interests, val];
      return { ...p, interests };
    });
  }

  if (loading) return <div className="p-8 text-center text-purple-700">Loading profile…</div>;

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-purple-50 via-purple-100 to-white">
      <div className="mx-auto max-w-4xl bg-white rounded-3xl shadow-lg p-8 border border-purple-200/60">
        <h1 className="text-3xl font-extrabold text-purple-800 mb-6">Student Profile</h1>

        {error && <div className="mb-4 rounded-lg bg-red-50 text-red-700 p-3 font-semibold">{error}</div>}
        {msg && <div className="mb-4 rounded-lg bg-green-50 text-green-700 p-3 font-semibold">{msg}</div>}

        <div className="flex items-start gap-6 mb-8">
          <div className="shrink-0">
            <div className="h-28 w-28 rounded-2xl overflow-hidden border border-purple-300/60 bg-purple-50 grid place-items-center">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="text-3xl font-bold text-purple-700">
                  {profile.fullName?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || 'S'}
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={uploadAvatar} className="mt-3 block" />
          </div>

          <form onSubmit={saveProfile} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">Full Name</label>
              <input className="w-full rounded-xl border border-purple-300 px-3 py-2 bg-purple-50/40" value={profile.fullName||''} onChange={e=>setProfile(p=>({...p, fullName:e.target.value}))} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">Email</label>
              <input type="email" className="w-full rounded-xl border border-purple-300 px-3 py-2 bg-purple-50/40" value={profile.email||''} onChange={e=>setProfile(p=>({...p, email:e.target.value}))} placeholder="name@college.edu" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">Branch/Department & Year</label>
              <input className="w-full rounded-xl border border-purple-300 px-3 py-2 bg-purple-50/40" value={profile.branchYear||''} onChange={e=>setProfile(p=>({...p, branchYear:e.target.value}))} placeholder="CSE 2nd Year" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">College/University</label>
              <input className="w-full rounded-xl border border-purple-300 px-3 py-2 bg-purple-50/40" value={profile.college||''} onChange={e=>setProfile(p=>({...p, college:e.target.value}))} placeholder="ABC Institute of Technology" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">Phone</label>
              <input className="w-full rounded-xl border border-purple-300 px-3 py-2 bg-purple-50/40" value={profile.phone||''} onChange={e=>setProfile(p=>({...p, phone:e.target.value}))} placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">Location/City</label>
              <input className="w-full rounded-xl border border-purple-300 px-3 py-2 bg-purple-50/40" value={profile.location||''} onChange={e=>setProfile(p=>({...p, location:e.target.value}))} placeholder="Optional" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-purple-900 mb-2">Interests/Skills</label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map(opt => (
                  <button type="button" key={opt} onClick={() => toggleInterest(opt)} className={`px-3 py-1 rounded-full border ${profile.interests.includes(opt) ? 'bg-purple-600 text-white border-purple-600' : 'bg-purple-50 text-purple-800 border-purple-300'}`}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-purple-900 mb-2">Bio / About Me</label>
              <textarea className="w-full rounded-xl border border-purple-300 px-3 py-2 bg-purple-50/40" rows={4} value={profile.bio||''} onChange={e=>setProfile(p=>({...p, bio:e.target.value}))} placeholder="Short description" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button disabled={saving} className="rounded-xl bg-gradient-to-r from-purple-700 to-purple-500 text-white font-semibold px-5 py-2 shadow disabled:opacity-60" type="submit">{saving ? 'Saving…' : 'Save Profile'}</button>
              <button type="button" className="rounded-xl border border-purple-300 px-5 py-2" onClick={()=>window.location.reload()}>Cancel</button>
            </div>
          </form>
        </div>

        <div className="text-sm text-purple-700/80">
          - Email is used for communication and optional login recovery in future.
          <br />- Profile photo supports PNG/JPG/GIF/WEBP up to 2MB.
        </div>
      </div>
    </div>
  );
}
