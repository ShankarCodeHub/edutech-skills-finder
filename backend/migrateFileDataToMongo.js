// backend/migrateFileDataToMongo.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Result = require('./models/Result');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edutech';

async function migrate() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  // Drop unique index on email if it exists
  try {
    await mongoose.connection.db.collection('users').dropIndex('email_1');
    console.log('Dropped unique index on email.');
  } catch (err) {
    if (err.codeName === 'IndexNotFound' || err.message.includes('index not found')) {
      console.log('No email index to drop.');
    } else {
      console.warn('Could not drop email index:', err.message);
    }
  }
  // Users
  if (fs.existsSync(USERS_FILE)) {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    for (const u of users) {
      if (u.username && u.password) {
        const exists = await User.findOne({ username: u.username });
        if (!exists) {
          await User.create({
            username: u.username,
            password: u.password,
            createdAt: u.createdAt || Date.now(),
            fullName: u.username,
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
          });
        }
      }
    }
    console.log('Users migrated.');
  }
  // Results
  if (fs.existsSync(RESULTS_FILE)) {
    const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));
    for (const r of results) {
      await Result.create({
        username: r.username,
        timestamp: r.timestamp ? new Date(r.timestamp) : Date.now(),
        subjectFocus: r.subjectFocus || null,
        answers: r.answers,
        scores: r.scores,
        message: r.message,
        recommendations: r.recommendations,
      });
    }
    console.log('Results migrated.');
  }
  await mongoose.disconnect();
  console.log('Migration complete.');
}

migrate().catch(e => { console.error(e); process.exit(1); });
