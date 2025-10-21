import React, { useState } from "react";

const STEP_DETAILS = {
  Python: "Start with Python basics: syntax, variables, loops, and libraries like NumPy and Pandas.",
  SQL: "Next, learn SQL for databases—focus on SELECT, INSERT, UPDATE, JOIN, and GROUP BY.",
  "Machine Learning": "Finally, dive into ML: study algorithms, scikit-learn, data preprocessing, and real-world projects."
};

export default function Roadmap() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="bg-purple-50/70 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-12 border border-purple-200">
      <h2 className="font-bold text-xl mb-6 text-purple-700">Skill Roadmap</h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 select-none">
        <Step label="Python" onClick={() => setSelected("Python")} />
        <Arrow />
        <Step label="SQL" onClick={() => setSelected("SQL")} />
        <Arrow />
        <Step label="Machine Learning" onClick={() => setSelected("Machine Learning")} />
      </div>
      {selected && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="text-lg font-semibold text-blue-700 mb-2">{selected}</div>
          <div className="text-gray-800">{STEP_DETAILS[selected]}</div>
        </div>
      )}
    </section>
  );
}

function Step({ label, onClick }) {
  return (
    <button
      className="bg-blue-600 text-white px-5 py-3 rounded-full font-semibold shadow focus:outline-none hover:bg-blue-700 transition"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function Arrow() {
  return <div className="text-blue-600 font-bold text-2xl">{`→`}</div>;
}
