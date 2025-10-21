import React, { useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function WeeklyPlanner() {
  // Accept planner prop, fallback to empty
  const props = arguments[0] || {};
  const initialPlan = props.planner || {};
  const [plan, setPlan] = useState(initialPlan);
  const [input, setInput] = useState("");
  const [selectedDay, setSelectedDay] = useState(days[0]);

  function handleAdd() {
    if (!input.trim()) return;
    setPlan({ ...plan, [selectedDay]: input });
    setInput("");
  }

  return (
    <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col items-center w-full">
      <h3 className="text-lg font-bold text-blue-700 mb-2">Weekly Skill Planner</h3>
      <div className="flex gap-2 mb-4 w-full max-w-md">
        <select
          value={selectedDay}
          onChange={e => setSelectedDay(e.target.value)}
          className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add skill/task..."
          className="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 transition"
        >
          Add
        </button>
      </div>
      <div className="w-full max-w-md grid grid-cols-2 gap-4">
        {days.map(day => (
          <div key={day} className="bg-white rounded-lg shadow px-4 py-2 flex flex-col items-center">
            <span className="font-bold text-blue-900 mb-1">{day}</span>
            <span className="text-blue-700">{plan[day] || "No task"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
