import React from "react";

const trends = [
  { label: "AI", value: 90, color: "#6366f1" },
  { label: "Cloud", value: 75, color: "#3b82f6" },
  { label: "Cybersecurity", value: 65, color: "#f59e42" },
  { label: "Data Science", value: 60, color: "#10b981" }
];

export default function SkillTrends() {
  // Accept trends prop, fallback to default trends
  const props = arguments[0] || {};
  const trendList = props.trends || trends;
  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-lg font-bold text-blue-700 mb-2">Top Skills in 2025</h3>
      <div className="w-full max-w-md space-y-4">
        {trendList.length === 0 ? (
          <div className="text-blue-700">No skill trends available.</div>
        ) : trendList.map(trend => (
          <div key={trend.label} className="flex items-center gap-3">
            <span className="font-bold text-blue-900 w-32">{trend.label}</span>
            <div className="flex-1 h-6 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-6 rounded-full"
                style={{ width: `${trend.value}%`, background: trend.color }}
              />
            </div>
            <span className="font-bold text-blue-700 ml-2">{trend.value}%</span>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-600 mt-4">Based on mock data and industry trends.</div>
    </div>
  );
}
