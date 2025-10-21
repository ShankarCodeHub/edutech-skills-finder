
import React, { useEffect, useState } from "react";
import Quiz from "./Quiz";
import { FaUserGraduate, FaClipboardCheck, FaMagic, FaChartLine, FaQuestionCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

// Map of skill/interest to AI recommendations
const RECOMMENDATION_MAP = {
  'AI': [
    'Try building a simple chatbot using Hugging Face Transformers.',
    'Explore free AI courses on Coursera or Fast.ai.',
    'Join AI communities like DeepLearning.AI or Kaggle.',
    'Experiment with OpenAI APIs for NLP tasks.'
  ],
  'Web Development': [
    'Build a personal portfolio website using React.',
    'Contribute to open source web projects on GitHub.',
    'Follow the freeCodeCamp curriculum for hands-on practice.',
    'Learn about web accessibility and responsive design.'
  ],
  'Data Science': [
    'Analyze datasets on Kaggle and participate in competitions.',
    'Practice data visualization with Seaborn or Plotly.',
    'Take the Data Science MicroMasters on edX.',
    'Explore real-world datasets and share insights.'
  ],
  'Cybersecurity': [
    'Try CTF challenges on Hack The Box or TryHackMe.',
    'Learn about OWASP Top 10 vulnerabilities.',
    'Follow security news on KrebsOnSecurity.',
    'Experiment with penetration testing tools in a safe lab.'
  ],
  'Mobile Apps': [
    'Build a simple app with React Native or Flutter.',
    'Publish your first app to the Play Store or App Store.',
    'Explore UI/UX best practices for mobile.',
    'Join mobile dev communities on Reddit or Discord.'
  ],
  'Cloud': [
    'Deploy a web app to AWS, Azure, or Google Cloud.',
    'Learn about serverless functions and cloud storage.',
    'Get hands-on with free cloud credits for students.',
    'Follow the official cloud provider tutorials.'
  ],
  'DevOps': [
    'Set up CI/CD pipelines with GitHub Actions.',
    'Learn Docker and containerization basics.',
    'Explore infrastructure as code with Terraform.',
    'Follow DevOps Roadmap on roadmap.sh.'
  ],
  'UI/UX': [
    'Redesign an existing app for better usability.',
    'Learn Figma or Adobe XD for prototyping.',
    'Study color theory and typography.',
    'Read "Don’t Make Me Think" by Steve Krug.'
  ],
  'Blockchain': [
    'Build a simple smart contract on Ethereum.',
    'Explore blockchain basics on CryptoZombies.',
    'Join blockchain hackathons and meetups.',
    'Follow news on CoinDesk and The Block.'
  ],
};

// Map of skill/interest to roadmap steps
const ROADMAP_MAP = {
  'AI': [
    'Learn Python basics and libraries (NumPy, Pandas)',
    'Study machine learning algorithms',
    'Explore deep learning and neural networks',
    'Build AI projects (NLP, CV, RL)',
    'Experiment with pre-trained models and APIs'
  ],
  'Web Development': [
    'Master HTML, CSS, and JavaScript',
    'Learn a frontend framework (React, Vue, Angular)',
    'Understand backend basics (Node.js, Express)',
    'Work with databases (SQL/NoSQL)',
    'Deploy web apps and learn version control'
  ],
  'Data Science': [
    'Learn Python for data analysis',
    'Practice data visualization',
    'Study statistics and probability',
    'Build predictive models',
    'Work on real-world datasets'
  ],
  'Cybersecurity': [
    'Understand security fundamentals',
    'Learn about common vulnerabilities',
    'Practice with security tools and labs',
    'Participate in CTFs and bug bounties',
    'Stay updated with security news'
  ],
  'Mobile Apps': [
    'Learn mobile programming basics',
    'Choose a framework (React Native, Flutter)',
    'Build and test simple apps',
    'Integrate APIs and backend',
    'Publish apps to stores'
  ],
  'Cloud': [
    'Understand cloud computing concepts',
    'Learn about major providers (AWS, Azure, GCP)',
    'Deploy simple apps to the cloud',
    'Explore serverless and containers',
    'Get certified (optional)'
  ],
  'DevOps': [
    'Learn about CI/CD pipelines',
    'Understand containerization (Docker)',
    'Explore infrastructure as code',
    'Automate deployments',
    'Monitor and maintain systems'
  ],
  'UI/UX': [
    'Study design principles',
    'Practice wireframing and prototyping',
    'Learn usability testing',
    'Work on real or mock projects',
    'Build a design portfolio'
  ],
  'Blockchain': [
    'Understand blockchain fundamentals',
    'Learn smart contract basics',
    'Build simple dApps',
    'Explore security and scalability',
    'Join blockchain communities'
  ],
};

function DashboardCard({ children }) {
  return (
    <div className="relative rounded-2xl border border-purple-200/60 bg-white/60 backdrop-blur-xl shadow-sm p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* subtle gradient line */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400 opacity-40" />
      {children}
    </div>
  );
}

export default function Dashboard() {
  // skills: personalized recommendations (array of strings)
  const [skills, setSkills] = useState([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizMessage, setQuizMessage] = useState("");
  const [quizScores, setQuizScores] = useState(null); // { Python, SQL, 'Machine Learning' }
  const roadmapRef = React.useRef(null);
  // Get logged-in student name
  const [studentName, setStudentName] = useState(() => {
    const lu = JSON.parse(localStorage.getItem("student_logged_in") || "null");
    return lu?.username || "Student";
  });
  const [profile, setProfile] = useState(null);

  // Validate token and fetch name from backend if available
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    (async () => {
      try {
        const res = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.username) setStudentName(data.username);
      } catch {}
    })();
  }, []);

  // Load full profile for the card (avatar, full name, branch, interests)
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    (async () => {
      try {
        let res = await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } });
        let data = null;
        if ((res.headers.get('content-type')||'').includes('application/json')) data = await res.json();
        if (!data) {
          const res2 = await fetch('http://localhost:5000/api/profile', { headers: { Authorization: `Bearer ${token}` } });
          if ((res2.headers.get('content-type')||'').includes('application/json')) data = await res2.json();
          res = res2;
        }
        if (!data || !res.ok) return;
        setProfile(data);
      } catch {}
    })();
  }, []);


  // Dynamically update skills (recommendations) based on profile interests or quiz
  useEffect(() => {
    // If quiz just completed, use quiz recommendations
    if (skills.length > 0) return;
    // Otherwise, use profile interests to generate recommendations
    if (profile && Array.isArray(profile.interests) && profile.interests.length > 0) {
      // Flatten all recommendations for selected interests
      const recs = profile.interests.flatMap((interest) => RECOMMENDATION_MAP[interest] || []);
      setSkills(recs);
    }
  }, [profile, skills.length]);

  return (
    <section id="dashboard" tabIndex="-1" className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 max-w-7xl mx-auto px-4">
      {/* 1) Account/Login */}
      <DashboardCard>
        <h2 className="flex items-center gap-2 font-extrabold text-2xl pb-3 mb-4 text-purple-900">
          <span className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 bg-clip-text text-transparent">Account</span>
        </h2>
        {localStorage.getItem('auth_token') ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-purple-900"><strong>User:</strong> {studentName}</div>
              <div className="flex items-center gap-2">
                <Link to="/profile" className="rounded-lg border border-purple-300/60 px-3 py-1.5 text-sm font-semibold text-purple-800 bg-white/70 hover:bg-purple-50">Edit Profile</Link>
                <button
                  onClick={() => { localStorage.removeItem('auth_token'); localStorage.removeItem('student_logged_in'); window.location.href = '/login'; }}
                  className="rounded-lg border border-red-300/60 px-3 py-1.5 text-sm font-semibold text-red-700 bg-white/70 hover:bg-red-50"
                >Logout</button>
              </div>
            </div>
            <Link 
              to="/dashboard" 
              className="w-full text-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2.5 text-sm font-bold shadow-lg hover:scale-105 transition"
            >
              🚀 Go to Full Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="text-purple-900">Please log in to access your personalized dashboard.</div>
            <Link to="/login" className="w-full text-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2.5 text-sm font-bold shadow-lg hover:scale-105 transition">
              Student Login
            </Link>
          </div>
        )}
      </DashboardCard>

      {/* 2) Student Profile */}
      <DashboardCard>
        <h2 className="flex items-center gap-2 font-extrabold text-2xl pb-3 mb-4 text-purple-900">
          <FaUserGraduate className="h-6 w-6 text-purple-700" aria-hidden="true" />
          <span className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 bg-clip-text text-transparent">Student Profile</span>
        </h2>
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-xl overflow-hidden border border-purple-300/60 bg-purple-50 grid place-items-center shrink-0">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="text-xl font-extrabold text-purple-700">
                {(profile?.fullName?.[0] || studentName?.[0] || 'S').toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-lg mb-1"><strong>Name:</strong> {profile?.fullName || studentName}</p>
            <p className="text-lg mb-1"><strong>Branch:</strong> {profile?.branchYear || '—'}</p>
            {profile?.college ? (<p className="text-lg mb-1"><strong>College:</strong> {profile.college}</p>) : null}
            {profile?.email ? (<p className="text-sm mb-1 text-purple-800/90"><strong>Email:</strong> {profile.email}</p>) : null}
            {profile?.phone ? (<p className="text-sm mb-1 text-purple-800/90"><strong>Phone:</strong> {profile.phone}</p>) : null}
            {profile?.location ? (<p className="text-sm mb-2 text-purple-800/90"><strong>Location:</strong> {profile.location}</p>) : null}
            <div className="mt-2">
              <div className="text-sm font-semibold text-purple-900 mb-1">Interests</div>
              {Array.isArray(profile?.interests) && profile.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full border border-purple-300/60 bg-white/70 text-purple-800 text-xs font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-purple-700/80 text-sm">No interests yet.</div>
              )}
            </div>
            <div className="mt-3">
              <Link to="/profile" className="inline-flex items-center gap-2 rounded-lg border border-purple-300/60 px-3 py-1.5 text-sm font-semibold text-purple-800 bg-white/70 backdrop-blur-md hover:bg-purple-50">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* 3) Skill Assessment (Quiz) */}
      <DashboardCard>
        <h2 className="flex items-center gap-2 font-extrabold text-2xl pb-3 mb-4 text-purple-900">
          <FaClipboardCheck className="h-6 w-6 text-purple-700" aria-hidden="true" />
          <span className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 bg-clip-text text-transparent">Skill Assessment</span>
        </h2>
        <button
          onClick={() => setQuizOpen(true)}
          className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-purple-600 to-purple-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-600/20 transition-all duration-300 hover:shadow-purple-700/30 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
        >
          <FaQuestionCircle className="h-5 w-5" aria-hidden="true" />
          Take Quiz
          <span className="pointer-events-none absolute left-[-150%] top-0 h-full w-1/2 bg-gradient-to-r from-white/0 via-white/60 to-white/0 opacity-40 blur-md animate-shine" />
        </button>
        <p className="mt-2 text-sm text-purple-700/80">2 min • No signup required</p>
        {quizMessage && (
          <p className="mt-3 text-purple-900 bg-purple-50/80 border border-purple-200 rounded p-2 text-sm">{quizMessage}</p>
        )}
      </DashboardCard>

      {/* 4) AI Recommendations */}
      <DashboardCard>
        <h2 className="flex items-center gap-2 font-extrabold text-2xl pb-3 mb-4 text-purple-900">
          <FaMagic className="h-6 w-6 text-purple-700" aria-hidden="true" />
          <span className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 bg-clip-text text-transparent">AI Recommendations</span>
        </h2>
        <div className="max-h-56 overflow-y-auto pr-1">
          {profile && Array.isArray(profile.interests) && profile.interests.length > 0 ? (
            <ul className="list-disc ml-6 space-y-2 text-purple-900 text-sm">
              {profile.interests.map((interest) =>
                (RECOMMENDATION_MAP[interest] || []).map((rec, idx) => (
                  <li key={interest + idx}><span className="font-semibold text-purple-700">[{interest}]</span> {rec}</li>
                ))
              )}
            </ul>
          ) : (
            <div className="text-purple-800/80">Add your interests to get personalized recommendations.</div>
          )}
        </div>
      </DashboardCard>

      {/* 5) Progress Tracker */}
      <DashboardCard>
        <h2 className="flex items-center gap-2 font-extrabold text-2xl pb-3 mb-4 text-purple-900">
          <FaChartLine className="h-6 w-6 text-purple-700" aria-hidden="true" />
          <span className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 bg-clip-text text-transparent">Progress Tracker</span>
        </h2>
        {quizScores ? (
          <>
            {(() => {
              const entries = Object.entries(quizScores);
              const sorted = entries.sort((a,b) => b[1]-a[1]);
              const [topName, topScore] = sorted[0];
              const max = typeof quizScores.maxPerTrack === 'number' ? quizScores.maxPerTrack : 8;
              const pct = Math.round((topScore / max) * 100);
              return (
                <>
                  <div className="w-full rounded-full h-8 bg-purple-200/70 shadow-inner overflow-hidden">
                    <div
                      className="relative h-8 rounded-full bg-gradient-to-r from-purple-600 via-purple-600 to-purple-500 transition-[width] duration-700"
                      style={{ width: `${pct}%` }}
                    >
                      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.35)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.35)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-progress" />
                    </div>
                  </div>
                  <p className="text-center mt-3 font-semibold text-purple-900">
                    Top fit: {topName} • {pct}% match
                  </p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-purple-900">
                    {sorted.map(([name, val]) => (
                      <div key={name} className="flex items-center justify-between rounded-lg border border-purple-200/60 bg-white/70 px-3 py-2">
                        <span className="font-semibold">{name}</span>
                        <span>
                          {val} / {max}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </>
        ) : (
          <>
            <div className="w-full rounded-full h-8 bg-purple-200/70 shadow-inner overflow-hidden">
              <div className="relative h-8 rounded-full bg-gradient-to-r from-purple-600 via-purple-600 to-purple-500 transition-[width] duration-700" style={{ width: `40%` }}>
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.35)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.35)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-progress" />
              </div>
            </div>
            <p className="text-center mt-3 font-semibold text-purple-900">Complete the quiz to personalize your roadmap</p>
          </>
        )}
      </DashboardCard>
      {quizOpen && (
        <Quiz
          isOpen={quizOpen}
          onClose={() => setQuizOpen(false)}
          onComplete={(data) => {
            // Update recommendations with quiz results
            if (Array.isArray(data.recommendations)) {
              setSkills(data.recommendations);
            }
            if (typeof data.message === "string") setQuizMessage(data.message);
            if (data.scores) setQuizScores({ ...data.scores, maxPerTrack: data.maxPerTrack || 10 });
            // after quiz completes, scroll to roadmap
            setTimeout(() => {
              try {
                roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } catch {}
            }, 200);
          }}
        />
      )}
      {/* Personalized Roadmap */}
      <div ref={roadmapRef} className="md:col-span-4">
        {profile && Array.isArray(profile.interests) && profile.interests.length > 0 ? (
          <div className="mt-2 rounded-2xl border border-purple-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
            <h3 className="text-2xl font-extrabold mb-4 text-purple-900">Your Learning Roadmap</h3>
            <div className="mb-3 text-purple-900 font-semibold">Based on your interests:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.interests.map((interest) => (
                <div key={interest} className="rounded-xl border border-purple-200 bg-white/80 p-4">
                  <div className="font-bold text-purple-700 mb-2">{interest}</div>
                  <ol className="list-decimal ml-5 space-y-1 text-purple-900">
                    {(ROADMAP_MAP[interest] || ["Explore resources and projects in this area!"]).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Link to="/roadmap" className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow hover:scale-105 transition">View Full Roadmap</Link>
            </div>
          </div>
        ) : (
          <div className="mt-2 rounded-2xl border border-purple-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm text-purple-800/80">Add your interests to see a personalized roadmap.</div>
        )}
      </div>
    </section>
  );
}

// Local styles for animations
// Keeping styles scoped to the component to avoid global leakage
// Tailwind utilities are used where possible; keyframes added here
// for the shine and progress stripe animations
// eslint-disable-next-line
export const __DashboardStyles = (
  <style>{`
    @keyframes shine-slide { 0% { transform: translateX(-150%);} 100% { transform: translateX(250%);} }
    .animate-shine { animation: shine-slide 2.2s linear infinite; }
    @keyframes progress-stripes { 0% { background-position: 0 0; } 100% { background-position: 24px 24px; } }
    .animate-progress { animation: progress-stripes 1.2s linear infinite; }
  `}</style>
);
