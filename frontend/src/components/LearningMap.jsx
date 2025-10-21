import React, { useState, useEffect } from "react";

// Skill node structure based on interests
const interestSkillPaths = {
  "AI": [
    { id: "ai_1", label: "Python Basics", requiredScore: 0 },
    { id: "ai_2", label: "Math & Statistics", requiredScore: 50 },
    { id: "ai_3", label: "Machine Learning", requiredScore: 60 },
    { id: "ai_4", label: "Deep Learning", requiredScore: 70 },
    { id: "ai_5", label: "AI Projects", requiredScore: 80 }
  ],
  "Web Development": [
    { id: "web_1", label: "HTML/CSS", requiredScore: 0 },
    { id: "web_2", label: "JavaScript", requiredScore: 50 },
    { id: "web_3", label: "React/Frontend", requiredScore: 60 },
    { id: "web_4", label: "Backend & APIs", requiredScore: 70 },
    { id: "web_5", label: "Full-Stack Projects", requiredScore: 80 }
  ],
  "Data Science": [
    { id: "ds_1", label: "Python Basics", requiredScore: 0 },
    { id: "ds_2", label: "Data Analysis", requiredScore: 50 },
    { id: "ds_3", label: "Data Visualization", requiredScore: 60 },
    { id: "ds_4", label: "Statistics & ML", requiredScore: 70 },
    { id: "ds_5", label: "DS Projects", requiredScore: 80 }
  ],
  "Cybersecurity": [
    { id: "cyber_1", label: "Networking Basics", requiredScore: 0 },
    { id: "cyber_2", label: "Linux & Security", requiredScore: 50 },
    { id: "cyber_3", label: "Ethical Hacking", requiredScore: 60 },
    { id: "cyber_4", label: "Penetration Testing", requiredScore: 70 },
    { id: "cyber_5", label: "Security Projects", requiredScore: 80 }
  ],
  "default": [
    { id: "def_1", label: "Python Basics", requiredScore: 0 },
    { id: "def_2", label: "SQL Fundamentals", requiredScore: 50 },
    { id: "def_3", label: "Machine Learning", requiredScore: 60 },
    { id: "def_4", label: "AI Projects", requiredScore: 70 }
  ]
};

export default function LearningMap({ learningMap = [], skills = [], interests = [] }) {
  console.log('LearningMap props:', { learningMap, skills, interests });
  
  // Determine which skill path to show based on user interests or skills
  const determineSkillPath = () => {
    // Check if user has specific interest
    if (interests && interests.length > 0) {
      const firstInterest = interests[0];
      if (interestSkillPaths[firstInterest]) {
        return interestSkillPaths[firstInterest];
      }
    }
    
    // Check if user has specific skills from quiz
    if (skills && skills.length > 0) {
      const skillLabels = skills.map(s => s.label);
      if (skillLabels.includes("AI & Machine Learning")) {
        return interestSkillPaths["AI"];
      }
      if (skillLabels.includes("Web Development")) {
        return interestSkillPaths["Web Development"];
      }
      if (skillLabels.includes("Data Science")) {
        return interestSkillPaths["Data Science"];
      }
      if (skillLabels.includes("Cybersecurity")) {
        return interestSkillPaths["Cybersecurity"];
      }
    }
    
    return interestSkillPaths["default"];
  };

  const nodes = determineSkillPath();
  const [unlockedNodes, setUnlockedNodes] = useState([nodes[0].id]);
  const [animatingNode, setAnimatingNode] = useState(null);

  // Auto-unlock nodes based on skill scores
  useEffect(() => {
    if (!skills || skills.length === 0) return;
    
    // Find the highest skill score
    const maxScore = Math.max(...skills.map(s => s.value || 0));
    console.log('Max skill score:', maxScore);
    
    // Unlock nodes based on score thresholds
    const newUnlocked = [nodes[0].id]; // First node always unlocked
    for (let i = 1; i < nodes.length; i++) {
      if (maxScore >= nodes[i].requiredScore) {
        newUnlocked.push(nodes[i].id);
      } else {
        break; // Stop at first locked node
      }
    }
    
    console.log('Auto-unlocking nodes:', newUnlocked);
    setUnlockedNodes(newUnlocked);
  }, [skills, nodes]);

  const unlockNext = () => {
    if (unlockedNodes.length < nodes.length) {
      const nextNode = nodes[unlockedNodes.length];
      setAnimatingNode(nextNode.id);
      
      setTimeout(() => {
        setUnlockedNodes([...unlockedNodes, nextNode.id]);
        setAnimatingNode(null);
      }, 300);
    }
  };

  const getNodeColor = (node, isUnlocked) => {
    if (isUnlocked) {
      return "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50";
    }
    if (animatingNode === node.id) {
      return "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/50 animate-pulse";
    }
    return "bg-gray-200 text-gray-500 opacity-60";
  };

  const canUnlockNext = () => {
    if (unlockedNodes.length >= nodes.length) return false;
    if (!skills || skills.length === 0) return true; // Allow manual unlock if no quiz taken
    
    const nextNode = nodes[unlockedNodes.length];
    const maxScore = Math.max(...skills.map(s => s.value || 0));
    return maxScore >= nextNode.requiredScore;
  };

  const getUnlockMessage = () => {
    if (unlockedNodes.length >= nodes.length) {
      return "🎉 All Skills Unlocked! You're amazing!";
    }
    if (!skills || skills.length === 0) {
      return "Take the quiz to unlock skills based on your performance!";
    }
    
    const nextNode = nodes[unlockedNodes.length];
    const maxScore = Math.max(...skills.map(s => s.value || 0));
    
    if (maxScore >= nextNode.requiredScore) {
      return `Ready to unlock: ${nextNode.label}`;
    } else {
      return `Need ${nextNode.requiredScore}% score to unlock ${nextNode.label} (Current: ${maxScore}%)`;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Skill Path Title */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-blue-700">
          {interests && interests.length > 0 ? `${interests[0]} Learning Path` : "Your Learning Path"}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {unlockedNodes.length} of {nodes.length} skills unlocked
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(unlockedNodes.length / nodes.length) * 100}%` }}
        />
      </div>

      {/* Skill Nodes */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {nodes.map((node, idx) => {
          const isUnlocked = unlockedNodes.includes(node.id);
          
          return (
            <div key={node.id} className="flex items-center">
              <div
                className={`relative flex flex-col items-center px-6 py-4 rounded-xl transition-all duration-300 transform ${
                  getNodeColor(node, isUnlocked)
                } ${isUnlocked ? "scale-105 hover:scale-110" : ""}`}
              >
                {/* Node Icon/Number */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isUnlocked ? "bg-white/30" : "bg-gray-300"
                }`}>
                  <span className={`text-lg font-bold ${isUnlocked ? "text-white" : "text-gray-500"}`}>
                    {idx + 1}
                  </span>
                </div>
                
                {/* Node Label */}
                <span className="font-bold text-sm text-center mb-1">{node.label}</span>
                
                {/* Status */}
                <span className="text-xs">
                  {isUnlocked ? "✅ Unlocked" : `🔒 ${node.requiredScore}% required`}
                </span>
                
                {/* Unlock Animation */}
                {animatingNode === node.id && (
                  <div className="absolute inset-0 rounded-xl bg-yellow-300/50 animate-ping" />
                )}
              </div>
              
              {/* Arrow between nodes */}
              {idx < nodes.length - 1 && (
                <span className="text-2xl text-gray-400 mx-2">→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Unlock Message */}
      <p className="text-sm text-center text-gray-700 mb-4 max-w-md">
        {getUnlockMessage()}
      </p>

      {/* Unlock Button */}
      <button
        onClick={unlockNext}
        disabled={!canUnlockNext()}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {unlockedNodes.length === nodes.length 
          ? "🎓 Completed!" 
          : canUnlockNext()
          ? "🔓 Unlock Next Skill"
          : "⚠️ Take Quiz to Progress"}
      </button>

      {/* Style for animations */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
