import React from "react";

// Simple donut chart using SVG
function DonutChart({ data }) {
  const total = 100;
  const colors = ["#3b82f6", "#6366f1", "#f59e42"];
  let startAngle = 0;
  let paths = [];

  data.forEach((item, idx) => {
    const angle = (item.value / total) * 360;
    const endAngle = startAngle + angle;
    const largeArc = angle > 180 ? 1 : 0;
    const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
    const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);
    paths.push(
      <path
        key={item.label}
        d={`M50,50 L${x1},${y1} A40,40 0 ${largeArc},1 ${x2},${y2} Z`}
        fill={colors[idx % colors.length]}
        opacity={0.85}
      />
    );
    startAngle = endAngle;
  });

  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      {paths}
      <circle cx={50} cy={50} r={28} fill="#fff" />
      <text x={50} y={54} textAnchor="middle" fontSize={16} fill="#3b82f6" fontWeight="bold">
        Skills
      </text>
    </svg>
  );
}

export default function SkillScoreMeter({ skills = [], darkMode = false }) {
  console.log('SkillScoreMeter received skills:', skills);
  
  // Convert skills to proper format if needed
  const validSkills = Array.isArray(skills) && skills.length > 0 && skills[0]?.label
    ? skills
    : [
        { label: "Coding", value: 80 },
        { label: "Logic", value: 60 },
        { label: "Problem Solving", value: 75 }
      ];

  console.log('SkillScoreMeter displaying:', validSkills);

  return (
    <div className="flex flex-col items-center">
      <DonutChart data={validSkills} />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {validSkills.map((skill, idx) => (
          <div key={skill.label || idx} className="flex flex-col items-center">
            <span className={`font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              {skill.label || skill}
            </span>
            <span className={`text-lg font-extrabold ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
              {skill.value || 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
