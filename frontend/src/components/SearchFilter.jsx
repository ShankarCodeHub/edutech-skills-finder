import React, { useState } from "react";

const courses = [
  { name: "Python Basics", category: "Data Science", level: "Beginner" },
  { name: "SQL Fundamentals", category: "Data Science", level: "Intermediate" },
  { name: "Machine Learning", category: "AI", level: "Advanced" },
  { name: "Web Development", category: "Web", level: "Beginner" },
  { name: "React", category: "Web", level: "Intermediate" },
  { name: "AI Projects", category: "AI", level: "Advanced" }
];

const categories = ["All", "AI", "Web", "Data Science"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function SearchFilter() {
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = courses.filter(course => {
    const matchCategory = category === "All" || course.category === category;
    const matchLevel = level === "All" || course.level === level;
    const matchSearch = course.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchLevel && matchSearch;
  });

  // Detect dark mode from parent (body or dashboard)
  const isDark = document.body.classList.contains('bg-gray-900') || document.body.classList.contains('dark') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  return (
    <div className={`rounded-xl p-6 shadow flex flex-col items-center w-full ${isDark ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-900'}`}>
      <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>Smart Search & Filter</h3>
      <div className="flex gap-4 mb-4 w-full max-w-md">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses..."
          className={`flex-1 px-4 py-2 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-900 text-white placeholder-gray-400' : 'border-blue-200'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={`px-3 py-2 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-blue-200'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={level}
          onChange={e => setLevel(e.target.value)}
          className={`px-3 py-2 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-blue-200'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
        >
          {levels.map(lvl => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
      </div>
      <div className="w-full max-w-md">
        {filtered.length === 0 ? (
          <div className={isDark ? 'text-blue-300' : 'text-blue-700'}>No courses found.</div>
        ) : (
          <ul className="space-y-2">
            {filtered.map(course => (
              <li key={course.name} className={`rounded-lg shadow px-4 py-2 flex justify-between items-center ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-blue-900'}`}>
                <span className={`font-bold ${isDark ? 'text-blue-200' : 'text-blue-900'}`}>{course.name}</span>
                <span className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{course.category} • {course.level}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
