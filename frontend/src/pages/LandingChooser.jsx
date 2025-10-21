import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingChooser() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const info = JSON.parse(localStorage.getItem('student_logged_in') || 'null');
    if (token && info?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (token && info?.username) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-white p-6">
      <div className="w-full max-w-xl bg-white/95 border border-blue-200 rounded-3xl shadow-2xl p-10 text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-4">Welcome to EduTech Skills Finder</h1>
        <p className="text-blue-900/90 text-lg mb-6">Choose how you want to continue:</p>

        <div className="flex flex-col items-center space-y-2 mb-8">
          <span className="text-blue-700 font-semibold">Admins manage courses and users, while students explore skills and track learning.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => {
              const token = localStorage.getItem('auth_token');
              const info = JSON.parse(localStorage.getItem('student_logged_in') || 'null');
              if (token && info?.role !== 'admin') {
                navigate('/home');
              } else {
                navigate('/login');
              }
            }}
            className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-xl shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Student Panel"
          >
            <span className="text-2xl">🎓</span> Student Panel
          </button>
          <button
            onClick={() => {
              const token = localStorage.getItem('auth_token');
              const info = JSON.parse(localStorage.getItem('student_logged_in') || 'null');
              if (token && info?.role === 'admin') {
                navigate('/admin');
              } else {
                navigate('/admin-login');
              }
            }}
            className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-600 text-white font-bold text-xl shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700"
            aria-label="Admin Panel"
          >
            <span className="text-2xl">🧑‍💼</span> Admin Panel
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease; }
      `}</style>
    </div>
  );
}
