import React, { useEffect, useState } from 'react';

export default function BackendStatusBanner() {
  const [status, setStatus] = useState('checking'); // checking | ok | warn | error
  const [msg, setMsg] = useState('');

  async function ping() {
    setStatus('checking');
    setMsg('');
    try {
      // Try generic backend reachability
      let res, data;
      async function tryUrl(url) {
        const r = await fetch(url, { method: 'GET' });
        const ct = r.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const d = await r.json();
          return { r, d };
        }
        return { r, d: null };
      }
      ({ r: res, d: data } = await tryUrl('/api/quiz'));
      if (!data) {
        ({ r: res, d: data } = await tryUrl('http://localhost:5000/api/quiz'));
      }
      if (!data || !res.ok) {
        const txt = data ? JSON.stringify(data) : (await res.text().catch(() => ''));
        throw new Error(txt || 'No JSON from backend');
      }

      // Optional: check AI health for extra info (non-fatal)
      let aiWarn = '';
      try {
        let aiRes, aiData;
        ({ r: aiRes, d: aiData } = await tryUrl('/api/ai-health'));
        if (!aiData) {
          ({ r: aiRes, d: aiData } = await tryUrl('http://localhost:5000/api/ai-health'));
        }
        if (aiData && aiRes.ok && aiData.ok === false) {
          aiWarn = aiData.message || 'AI not configured';
        }
      } catch {}

      if (aiWarn) {
        setStatus('warn');
        setMsg(aiWarn);
      } else {
        setStatus('ok');
        setMsg('Connected');
      }
    } catch (e) {
      setStatus('error');
      setMsg(e.message || 'Backend unreachable');
    }
  }

  useEffect(() => {
    ping();
    const id = setInterval(ping, 10000); // recheck every 10s
    return () => clearInterval(id);
  }, []);

  const color = status === 'ok' ? 'bg-green-600' : status === 'warn' ? 'bg-yellow-500' : status === 'checking' ? 'bg-purple-500' : 'bg-red-600';
  const label = status === 'checking' ? 'Checking…' : status === 'ok' ? 'Backend: Connected' : status === 'warn' ? 'Backend: Connected (AI)' : 'Backend: Disconnected';

  return (
    <div className="fixed left-4 bottom-4 z-50">
      <div className="flex items-center gap-3 rounded-2xl border border-purple-200/60 bg-white/90 backdrop-blur-xl shadow-lg px-3 py-2">
        <span className={`inline-block h-3 w-3 rounded-full ${color}`} />
        <div className="text-sm text-purple-900 font-semibold select-none">
          {label}
          {msg && <span className="ml-2 text-xs text-purple-700/80">{msg}</span>}
        </div>
        <button
          type="button"
          onClick={ping}
          className="text-xs font-semibold text-purple-700 underline hover:text-purple-900"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
