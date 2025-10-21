import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Guard() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const info = JSON.parse(localStorage.getItem('student_logged_in') || 'null');
    if (token && info?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (token && info?.role !== 'admin') {
      navigate('/dashboard', { replace: true });
    } else {
      // No auth -> show admin login first as requested
      navigate('/admin-login', { replace: true });
    }
  }, [navigate]);
  return null;
}
