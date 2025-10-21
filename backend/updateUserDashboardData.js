// backend/updateUserDashboardData.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edutech';

async function updateUsers() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const dashboardData = {
    skills: [
      { label: "Python", value: 85 },
      { label: "SQL", value: 70 },
      { label: "Machine Learning", value: 60 },
      { label: "Web Development", value: 75 }
    ],
    badges: [
      { name: "Python Pro", icon: "🐍", description: "Completed Python fundamentals" },
      { name: "SQL Star", icon: "⭐", description: "Mastered SQL queries" },
      { name: "First Quiz", icon: "🎯", description: "Completed your first quiz" }
    ],
    careerPaths: [
      { interest: "data + coding", path: ["Python", "SQL", "Machine Learning", "Data Analysis"] },
      { interest: "web development", path: ["HTML", "CSS", "JavaScript", "React"] },
      { interest: "ai + automation", path: ["Python", "Machine Learning", "AI", "Automation"] }
    ],
    learningMap: [
      { id: 1, label: "Python Basics" },
      { id: 2, label: "SQL Fundamentals" },
      { id: 3, label: "Machine Learning" },
      { id: 4, label: "AI Projects" }
    ],
    messages: [
      { sender: "bot", text: "Hi! Ask me about courses, learning plans, or quizzes." }
    ],
    trends: [
      { label: "AI", value: 90, color: "#6366f1" },
      { label: "Cloud", value: 75, color: "#3b82f6" },
      { label: "Cybersecurity", value: 65, color: "#f59e42" },
      { label: "Data Science", value: 60, color: "#10b981" }
    ],
    mentors: [
      { name: "Dr. Alice Smith", expertise: "AI & Data Science", avatar: "🧑‍🔬" },
      { name: "Mr. John Doe", expertise: "Web Development", avatar: "🧑‍💻" },
      { name: "Ms. Priya Patel", expertise: "Cloud & DevOps", avatar: "🧑‍🚀" }
    ],
    planner: {
      Monday: "Python practice",
      Tuesday: "SQL review",
      Wednesday: "ML project",
      Thursday: "Web development",
      Friday: "Project work"
    }
  };

  const result = await User.updateMany(
    { role: { $ne: 'admin' } }, // Update all non-admin users
    { $set: dashboardData }
  );

  console.log(`Updated ${result.modifiedCount} users with dashboard data`);

  await mongoose.disconnect();
  console.log('Done!');
}

updateUsers().catch(e => {
  console.error(e);
  process.exit(1);
});
