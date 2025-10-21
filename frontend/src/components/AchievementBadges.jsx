import React, { useState, useEffect, useRef } from "react";

// Badge definitions with unlock criteria
const BADGE_DEFINITIONS = [
  // Milestones
  {
    id: "first_steps",
    name: "First Steps",
    icon: "👶",
    description: "Complete your first quiz",
    category: "milestone",
    requirement: { type: "quiz_taken", value: 1 },
  },
  // Beginner (>=30%)
  {
    id: "coding_rookie",
    name: "Coding Rookie",
    icon: "💻",
    description: "Score 30%+ in any skill",
    category: "skill",
    requirement: { type: "min_score", skill: "any", value: 30 },
  },
  // Intermediate (>=50%)
  {
    id: "quick_learner",
    name: "Quick Learner",
    icon: "⚡",
    description: "Score 50%+ in any skill",
    category: "skill",
    requirement: { type: "min_score", skill: "any", value: 50 },
  },
  {
    id: "python_padawan",
    name: "Python Padawan",
    icon: "🐍",
    description: "Score 50%+ in Coding",
    category: "skill",
    requirement: { type: "min_score", skill: "Coding", value: 50 },
  },
  {
    id: "ai_enthusiast",
    name: "AI Enthusiast",
    icon: "🤖",
    description: "Score 50%+ in AI & Machine Learning",
    category: "skill",
    requirement: { type: "min_score", skill: "AI & Machine Learning", value: 50 },
  },
  {
    id: "web_apprentice",
    name: "Web Apprentice",
    icon: "🌐",
    description: "Score 50%+ in Web Development",
    category: "skill",
    requirement: { type: "min_score", skill: "Web Development", value: 50 },
  },
  // Advanced (>=70%)
  {
    id: "skilled_coder",
    name: "Skilled Coder",
    icon: "🎯",
    description: "Score 70%+ in any skill",
    category: "skill",
    requirement: { type: "min_score", skill: "any", value: 70 },
  },
  {
    id: "python_pro",
    name: "Python Pro",
    icon: "🐍✨",
    description: "Score 70%+ in Coding",
    category: "skill",
    requirement: { type: "min_score", skill: "Coding", value: 70 },
  },
  {
    id: "data_wizard",
    name: "Data Wizard",
    icon: "📊",
    description: "Score 70%+ in Data Science",
    category: "skill",
    requirement: { type: "min_score", skill: "Data Science", value: 70 },
  },
  {
    id: "security_expert",
    name: "Security Expert",
    icon: "🛡️",
    description: "Score 70%+ in Cybersecurity",
    category: "skill",
    requirement: { type: "min_score", skill: "Cybersecurity", value: 70 },
  },
  // Expert (>=80%)
  {
    id: "high_achiever",
    name: "High Achiever",
    icon: "🏆",
    description: "Score 80%+ in any skill",
    category: "achievement",
    requirement: { type: "min_score", skill: "any", value: 80 },
  },
  {
    id: "ai_master",
    name: "AI Master",
    icon: "🤖⭐",
    description: "Score 80%+ in AI & Machine Learning",
    category: "skill",
    requirement: { type: "min_score", skill: "AI & Machine Learning", value: 80 },
  },
  {
    id: "full_stack_hero",
    name: "Full Stack Hero",
    icon: "🚀",
    description: "Score 80%+ in Web Development",
    category: "skill",
    requirement: { type: "min_score", skill: "Web Development", value: 80 },
  },
  // Master (>=90%)
  {
    id: "perfection_seeker",
    name: "Perfection Seeker",
    icon: "💎",
    description: "Score 90%+ in any skill",
    category: "achievement",
    requirement: { type: "min_score", skill: "any", value: 90 },
  },
  {
    id: "grandmaster",
    name: "Grandmaster",
    icon: "👑",
    description: "Score 90%+ in 3 different skills",
    category: "achievement",
    requirement: { type: "multi_skill", count: 3, value: 90 },
  },
  // Special
  {
    id: "versatile_learner",
    name: "Versatile Learner",
    icon: "🎨",
    description: "Score 60%+ in 4 different skills",
    category: "achievement",
    requirement: { type: "multi_skill", count: 4, value: 60 },
  },
  {
    id: "problem_solver",
    name: "Problem Solver",
    icon: "🧩",
    description: "Score 70%+ in Problem Solving",
    category: "skill",
    requirement: { type: "min_score", skill: "Problem Solving", value: 70 },
  },
  {
    id: "logic_master",
    name: "Logic Master",
    icon: "🧠",
    description: "Score 70%+ in Logic",
    category: "skill",
    requirement: { type: "min_score", skill: "Logic", value: 70 },
  },
];

export default function AchievementBadges({ badges = [], skills = [], darkMode = false }) {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [newlyEarned, setNewlyEarned] = useState(null);
  const prevEarnedRef = useRef([]);

  // Compute earned badges from skills
  useEffect(() => {
    if (!skills || skills.length === 0) {
      setEarnedBadges([]);
      return;
    }

    const earned = [];
    BADGE_DEFINITIONS.forEach((badge) => {
      const req = badge.requirement;
      if (req.type === "quiz_taken") {
        if (skills.length > 0) earned.push(badge.id);
      } else if (req.type === "min_score") {
        if (req.skill === "any") {
          const maxScore = Math.max(...skills.map((s) => s.value || 0));
          if (maxScore >= req.value) earned.push(badge.id);
        } else {
          const skill = skills.find((s) => s.label === req.skill);
          if (skill && (skill.value || 0) >= req.value) earned.push(badge.id);
        }
      } else if (req.type === "multi_skill") {
        const count = skills.filter((s) => (s.value || 0) >= req.value).length;
        if (count >= req.count) earned.push(badge.id);
      }
    });

    // Show a toast-like notification for first newly earned badge
    const newOnes = earned.filter((id) => !prevEarnedRef.current.includes(id));
    setEarnedBadges(earned);
    if (newOnes.length > 0) {
      setNewlyEarned(newOnes[0]);
      const t = setTimeout(() => setNewlyEarned(null), 2500);
      return () => clearTimeout(t);
    }
    prevEarnedRef.current = earned;
  }, [skills]);

  const grouped = {
    milestone: BADGE_DEFINITIONS.filter((b) => b.category === "milestone"),
    skill: BADGE_DEFINITIONS.filter((b) => b.category === "skill"),
    achievement: BADGE_DEFINITIONS.filter((b) => b.category === "achievement"),
  };

  const renderBadge = (badge) => {
    const isEarned = earnedBadges.includes(badge.id);
    const isNew = newlyEarned === badge.id;
    return (
      <div
        key={badge.id}
        className={`relative flex flex-col items-center px-3 py-3 rounded-xl shadow-lg transition-all duration-300 group ${
          isEarned
            ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 hover:scale-110 hover:shadow-2xl"
            : darkMode
            ? "bg-gray-700 text-gray-500 opacity-50 hover:opacity-70"
            : "bg-gray-100 text-gray-500 opacity-50 hover:opacity-70"
        } ${isNew ? "animate-bounce" : ""}`}
        title={badge.description}
      >
        <span className={`text-4xl mb-2 ${isEarned ? "filter drop-shadow-lg" : "grayscale"}`}>{badge.icon}</span>
        <span className={`font-bold text-xs text-center ${isEarned ? "text-gray-900" : ""}`}>{badge.name}</span>
        <span className="text-xs mt-1">{isEarned ? "✅" : "🔒"}</span>
        {/* Tooltip */}
        <div
          className={`absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 rounded-lg shadow-xl z-10 ${
            darkMode ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-200"
          }`}
        >
          <p className="text-xs font-semibold mb-1">{badge.name}</p>
          <p className="text-xs">{badge.description}</p>
          {!isEarned && <p className="text-xs text-yellow-600 mt-1">Keep learning to unlock!</p>}
        </div>
        {isNew && <div className="absolute inset-0 rounded-xl bg-yellow-300/50 animate-ping" />}
        {isEarned && <div className="absolute inset-0 rounded-xl bg-yellow-400/20 blur-md -z-10" />}
      </div>
    );
  };

  const earnedCount = earnedBadges.length;
  const totalCount = BADGE_DEFINITIONS.length;
  const progressPercent = (earnedCount / totalCount) * 100;

  return (
    <div className="flex flex-col">
      {/* Header + Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-blue-900"}`}>Your Badges</h3>
          <span className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {earnedCount} / {totalCount}
          </span>
        </div>
        <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{progressPercent.toFixed(0)}% Complete</p>
      </div>

      {/* New badge toast */}
      {newlyEarned && (
        <div className="mb-4 p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl shadow-lg animate-bounce">
          <p className="text-sm font-bold text-center">
            🎉 New Badge Unlocked: {BADGE_DEFINITIONS.find((b) => b.id === newlyEarned)?.name}!
          </p>
        </div>
      )}

      {/* Sections */}
      {grouped.milestone.length > 0 && (
        <div className="mb-4">
          <h4 className={`text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>🎯 Milestone Badges</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{grouped.milestone.map(renderBadge)}</div>
        </div>
      )}
      {grouped.skill.length > 0 && (
        <div className="mb-4">
          <h4 className={`text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>💡 Skill Badges</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{grouped.skill.map(renderBadge)}</div>
        </div>
      )}
      {grouped.achievement.length > 0 && (
        <div className="mb-2">
          <h4 className={`text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>🏆 Achievement Badges</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{grouped.achievement.map(renderBadge)}</div>
        </div>
      )}

      {/* Footer message */}
      <div className={`mt-4 p-3 rounded-lg ${darkMode ? "bg-gray-800" : "bg-blue-50"}`}>
        <p className={`text-sm text-center ${darkMode ? "text-gray-300" : "text-blue-800"}`}>
          {earnedCount === 0
            ? "🎯 Take the quiz to start earning badges!"
            : earnedCount === totalCount
            ? "🎉 Congratulations! You've earned all badges!"
            : `🚀 Keep learning! ${totalCount - earnedCount} more badges to unlock.`}
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(-5%); } 50% { transform: translateY(0); } }
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes ping { 75%, 100% { transform: scale(1.1); opacity: 0; } }
        .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
}
