import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Placeholder imports for future features
import CareerPathGenerator from "./CareerPathGenerator";
import SkillScoreMeter from "./SkillScoreMeter";
import LearningMap from "./LearningMap";
import ChatbotMentor from "./ChatbotMentor";
import AchievementBadges from "./AchievementBadges";
import SkillTrends from "./SkillTrends";
import SearchFilter from "./SearchFilter";
import MentorConnect from "./MentorConnect";
import WeeklyPlanner from "./WeeklyPlanner";
import Quiz from "./Quiz";

export default function DashboardV2() {
  // Theme toggle state
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile on mount
  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('No auth token found, redirecting to login');
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { state: { message: 'Please login to access your dashboard' } });
      }, 1500);
      return;
    }
    console.log('Fetching user profile with token:', token.substring(0, 20) + '...');
    fetch('/api/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        console.log('Profile response status:', res.status);
        if (res.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('student_logged_in');
          navigate('/login', { state: { message: 'Session expired. Please login again.' } });
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          console.log('Profile data received:', data);
          console.log('User skills:', data.skills);
          setUser(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch profile:', err);
        setUser(null);
        setLoading(false);
      });
  }, [navigate]);

  // Show loading or error if needed
  if (loading || !user) {
    return (
      <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-blue-50 text-blue-900 min-h-screen"}>
        <div className="container mx-auto py-8 px-4 text-center">
          <div className="text-2xl font-bold mb-4">
            {loading ? "Loading your dashboard..." : "Redirecting to login..."}
          </div>
          {!localStorage.getItem('auth_token') && (
            <div className="text-lg text-blue-700 mb-4">
              Please login to access your personalized dashboard
            </div>
          )}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-blue-50 text-blue-900 min-h-screen"}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold">Welcome, {user.name || user.username || 'Student'}!</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowQuiz(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow hover:scale-105 transition"
            >
              📝 Take Quiz
            </button>
            <button
              onClick={() => setDarkMode((v) => !v)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 transition"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
        
        {/* Quiz Modal */}
        <Quiz 
          isOpen={showQuiz} 
          onClose={() => setShowQuiz(false)}
          onComplete={(result) => {
            console.log('Quiz completed:', result);
            setShowQuiz(false);
            // Refresh user profile to get updated skills
            const token = localStorage.getItem('auth_token');
            if (token) {
              fetch('/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
              })
                .then(res => res.json())
                .then(data => {
                  console.log('Updated profile data:', data);
                  setUser(data);
                })
                .catch(err => console.error('Failed to refresh profile:', err));
            }
          }}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI-Based Career Path Generator */}
          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-900"}`}>
            <h2 className="text-xl font-bold mb-2">AI-Based Career Path Generator</h2>
            <p className="mb-4">Suggest personalized skill paths based on your interests.</p>
              <CareerPathGenerator careerPaths={user.careerPaths || []} />
          </div>
          {/* Skill Score Meter Dashboard */}
          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-900"}`}>
            <h2 className="text-xl font-bold mb-2">Skill Score Meter</h2>
            <p className="mb-4">Visualize your strengths using charts based on quiz results.</p>
            {(!user.skills || user.skills.length === 0) && (
              <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-300 dark:border-yellow-700">
                <p className="font-semibold">📊 Take the quiz to see your skill scores!</p>
                <p className="text-sm mt-1">Your quiz answers will be analyzed to calculate your skill proficiency in different areas.</p>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="mt-3 px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                >
                  Take Quiz Now
                </button>
              </div>
            )}
              <SkillScoreMeter skills={user.skills || []} darkMode={darkMode} />
          </div>
          {/* Interactive Learning Map */}
          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-900"}`}>
            <h2 className="text-xl font-bold mb-2">Interactive Learning Map</h2>
            <p className="mb-4">Unlock skill nodes as you progress based on quiz performance.</p>
              <LearningMap 
                learningMap={user.learningMap || []} 
                skills={user.skills || []}
                interests={user.interests || []}
              />
          </div>
          {/* Advanced AI Chatbot Mentor */}
          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-900"}`}>
            <h2 className="text-xl font-bold mb-2">AI Chatbot Mentor</h2>
            <p className="mb-4">Ask questions, get plans, and take quizzes.</p>
              <ChatbotMentor messages={user.messages || []} />
          </div>
          {/* Gamification & Achievement Badges */}
          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-900"}`}>
            <h2 className="text-xl font-bold mb-2">Achievement Badges</h2>
            <p className="mb-4">Earn badges for skill milestones.</p>
              <AchievementBadges badges={user.badges || []} skills={user.skills || []} darkMode={darkMode} />
          </div>
          {/* Skill Trends & Insights Section */}
          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-900"}`}>
            <h2 className="text-xl font-bold mb-2">Skill Trends & Insights</h2>
            <p className="mb-4">See trending skills with charts.</p>
              <SkillTrends trends={user.trends || []} />
          </div>
          {/* Smart Search & Filter System */}
          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-900"}`}>
            <h2 className="text-xl font-bold mb-2">Smart Search & Filter</h2>
            <p className="mb-4">Filter by difficulty and category.</p>
              <SearchFilter darkMode={darkMode} />
          </div>
          {/* Mentor Connect (Optional) */}
          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-900"}`}>
            <h2 className="text-xl font-bold mb-2">Mentor Connect</h2>
            <p className="mb-4">Book sessions or ask questions to mentors.</p>
              <MentorConnect mentors={user.mentors || []} />
          </div>
          {/* Weekly Skill Planner */}
          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-900"}`}>
            <h2 className="text-xl font-bold mb-2">Weekly Skill Planner</h2>
            <p className="mb-4">Plan your weekly learning schedule.</p>
              <WeeklyPlanner planner={user.planner || {}} />
          </div>
        </div>
      </div>
    </div>
  );
}
