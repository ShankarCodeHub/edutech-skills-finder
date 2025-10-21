

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const User = require('./models/User');
const Result = require('./models/Result');

const app = express();
app.use(cors({
  origin: true, // allow all origins during development
  methods: ["GET", "POST", "PATCH", "PUT", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

// Static uploads
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// Multer config for avatars
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safe = (req.user?.username || 'anon') + '-' + Date.now() + ext;
    cb(null, safe);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  }
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edutech';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Diagnostic GET endpoint for /api/quiz to confirm backend is reachable
app.get("/api/quiz", (req, res) => {
  res.json({ status: "ok", message: "Quiz API is reachable. Use POST for quiz submission." });
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { username: payload.username };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}


// Auth: Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password || password.length < 4) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    const hash = bcrypt.hashSync(password, 10);
    const user = new User({ username, password: hash });
    await user.save();
    return res.json({ ok: true, message: 'Registered successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed', detail: err.message });
  }
});


// Auth: Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Invalid input' });
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, username });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', detail: err.message });
  }
});

// Health endpoint for AI integration
app.get('/api/ai-health', async (req, res) => {
  const hasKey = !!process.env.OPENAI_API_KEY;
  res.json({
    ok: hasKey,
    model: 'gpt-4o-mini',
    message: hasKey ? 'AI configured' : 'Missing OPENAI_API_KEY in backend .env',
  });
});

app.get("/api/skills", (req, res) => {
  res.json(["Python", "SQL", "Machine Learning"]);
});

app.post('/api/ai-response', async (req, res) => {
  const { question } = req.body || {};
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ answer: 'Please provide a question.', error: 'Invalid payload' });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ answer: 'AI is not configured. Please set OPENAI_API_KEY on the server.', error: 'Missing OPENAI_API_KEY' });
  }
  try {
    let completion;
    const primaryModel = 'gpt-4o-mini';
    const fallbackModel = 'gpt-3.5-turbo';
    try {
      completion = await openai.chat.completions.create({
        model: primaryModel,
        messages: [
          { role: 'system', content: 'You are a concise mentor for students. Answer clearly and helpfully.' },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
      });
    } catch (err) {
      const msg = err?.message || '';
      const status = err?.status || err?.response?.status;
      const isModelError = status === 404 || /model/i.test(msg);
      if (isModelError) {
        console.warn(`Model ${primaryModel} unavailable, falling back to ${fallbackModel}`);
        completion = await openai.chat.completions.create({
          model: fallbackModel,
          messages: [
            { role: 'system', content: 'You are a concise mentor for students. Answer clearly and helpfully.' },
            { role: 'user', content: question },
          ],
          temperature: 0.7,
        });
      } else {
        throw err;
      }
    }
    res.json({ answer: completion.choices?.[0]?.message?.content || 'No answer received.' });
  } catch (error) {
    const status = error.status || error.response?.status || 500;
    const detail = error.message || error.response?.data?.error?.message || 'Unknown error';
    console.error('OpenAI error:', detail);
    res.status(status).json({ answer: 'Sorry, unable to get answer.', error: detail });
  }
});


// Simple quiz scoring endpoint
// Expects: { answers: { ... }, subjectFocus }
// Returns: { scores: { Python: number, SQL: number, 'Machine Learning': number }, recommendations: string[], message: string }
app.post("/api/quiz", authMiddleware, async (req, res) => {
  const { answers, subjectFocus } = req.body || {};
  const scores = { Python: 0, SQL: 0, "Machine Learning": 0 };

  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Invalid payload. Provide { answers: {...} }" });
  }

  // Support two payload styles:
  // 1) Legacy: answers.q1..q5
  // 2) Current Quiz.jsx: keys like python_q1, sql_q1, ml_q1, exp_lvl, time_commit, interests_multi
  const keys = Object.keys(answers);
  const isLegacy = keys.some((k) => /^q[1-5]$/.test(k));

  if (isLegacy) {
    // q1: Interest area
    switch (answers.q1) {
      case "Building scripts/automation":
        scores.Python += 2; break;
      case "Working with databases/queries":
        scores.SQL += 2; break;
      case "Training ML models/analytics":
        scores["Machine Learning"] += 2; break;
      default:
        break;
    }
    // q2: Math/statistics comfort
    switch (answers.q2) {
      case "Low":
        scores.Python += 1; break;
      case "Medium":
        scores.SQL += 1; break;
      case "High":
        scores["Machine Learning"] += 2; break;
      default:
        break;
    }
    // q3: Preferred projects
    switch (answers.q3) {
      case "Web scraping/automation":
        scores.Python += 2; break;
      case "Reporting/BI dashboards":
        scores.SQL += 2; break;
      case "Predictive analytics/classification":
        scores["Machine Learning"] += 2; break;
      default:
        break;
    }
    // q4: Experience level
    switch (answers.q4) {
      case "Beginner":
        scores.Python += 2; break;
      case "Intermediate":
        scores.SQL += 2; break;
      case "Advanced":
        scores["Machine Learning"] += 1; break;
      default:
        break;
    }
    // q5: Time commitment
    switch (answers.q5) {
      case "< 3 hrs/week":
        scores.Python += 1; break;
      case "3-6 hrs/week":
        scores.SQL += 1; break;
      case "> 6 hrs/week":
        scores["Machine Learning"] += 1; break;
      default:
        break;
    }
  } else {
    // Modern schema scoring
    for (const [key, val] of Object.entries(answers)) {
      if (key.startsWith("python_")) {
        // Base weight per Python-answer
        scores.Python += 1;
        if (key === "python_q7" && /high/i.test(String(val))) scores.Python += 1; // OOP high bonus
        if (key === "python_q8" && /high/i.test(String(val))) scores.Python += 1; // automation interest bonus
        if (key === "python_q2" && typeof val === "string" && /a lot/i.test(val)) {
          scores.Python += 1; // bonus for strong prior experience
        }
      } else if (key.startsWith("sql_")) {
        scores.SQL += 1;
        if (key === "sql_q3" && /often/i.test(String(val))) scores.SQL += 1; // JOINs often bonus
        if (key === "sql_q4" && /high/i.test(String(val))) scores.SQL += 1; // aggregations comfort
        if (key === "sql_q7" && /yes/i.test(String(val))) scores.SQL += 1; // BI tools familiarity
      } else if (key.startsWith("ml_")) {
        if (key === "ml_q2" && typeof val === "string") {
          // math/stats: Strong > Average > Needs work
          if (/strong/i.test(val)) scores["Machine Learning"] += 2;
          else if (/average/i.test(val)) scores["Machine Learning"] += 1;
          else scores["Machine Learning"] += 0;
        } else {
          scores["Machine Learning"] += 1;
          if (key === "ml_q4" && /good/i.test(String(val))) scores["Machine Learning"] += 1; // sklearn familiarity
          if (key === "ml_q7" && /high/i.test(String(val))) scores["Machine Learning"] += 1; // deployment interest
          if (key === "ml_q8" && /comfortable/i.test(String(val))) scores["Machine Learning"] += 1; // metrics comfort
        }
      } else if (key === "exp_lvl") {
        if (val === "Beginner") scores.Python += 2;
        else if (val === "Intermediate") scores.SQL += 2;
        else if (val === "Advanced") scores["Machine Learning"] += 1;
      } else if (key === "time_commit") {
        if (val === "< 3 hrs/week") scores.Python += 1;
        else if (val === "3-6 hrs/week") scores.SQL += 1;
        else if (val === "> 6 hrs/week") scores["Machine Learning"] += 1;
      } else if (key === "interests_multi") {
        // Interests can tilt weights slightly across tracks
        if (Array.isArray(val)) {
          const v = val.map(String);
          if (v.includes('AI') || v.includes('Data Science')) scores["Machine Learning"] += 2;
          if (v.includes('Web Development')) scores.Python += 1;
          if (v.includes('DevOps') || v.includes('Cloud')) scores.SQL += 1; // infra/data tilt
          if (v.includes('Blockchain')) scores.Python += 1;
        }
      }
    }
  }

  // Bias toward selected focus
  if (subjectFocus && scores[subjectFocus] !== undefined) {
    scores[subjectFocus] += 1;
  }

  // Build recommendations from top two
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topTwo = sorted.slice(0, 2).map(([n]) => n);
  const recs = [];
  if (topTwo.includes("Python")) recs.push("Python Basics", "Automate Boring Stuff", "NumPy & Pandas");
  if (topTwo.includes("SQL")) recs.push("SQL Joins & Aggregations", "Data Modeling", "BI Dashboards");
  if (topTwo.includes("Machine Learning")) recs.push("Supervised Learning", "Model Evaluation", "scikit-learn Projects");

  const message = `Top fit: ${sorted[0][0]}. Secondary: ${sorted[1] ? sorted[1][0] : "N/A"}.`;
  const maxPerTrack = 20; // increased upper-bound to reflect more questions and bonuses

  // Persist result for this user
  const username = req.user?.username || 'anonymous';
  try {
    await Result.create({
      username,
      subjectFocus: subjectFocus || null,
      answers,
      scores,
      message,
      recommendations: recs,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save result', detail: err.message });
  }

  return res.json({ scores, recommendations: recs, message, maxPerTrack });
});

// Profile endpoints
app.get('/api/me', authMiddleware, (req, res) => {
  const { answers, selectedInterests } = req.body || {};
});


app.get('/api/my-results', authMiddleware, async (req, res) => {
  const username = req.user.username;
  try {
  // Support three payload styles:
  // 1) Legacy: answers.q1..q5
  // 2) Subject-based: keys like python_q1, sql_q1, ml_q1, exp_lvl, time_commit, interests_multi
  // 3) Interests-based: keys like ai_q1, web_q1, ds_q1, cyber_q1, mobile_q1, cloud_q1, devops_q1, uiux_q1, bc_q1, exp_lvl, time_commit
    return res.status(500).json({ error: 'Failed to fetch results', detail: err.message });
  }
  const isInterestsBased = keys.some((k) => /^(ai|web|ds|cyber|mobile|cloud|devops|uiux|bc)_q\d+$/.test(k));
});

// Profile endpoints
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, __v, _id, ...publicFields } = user;
    res.json(publicFields);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load profile', detail: err.message });
  }
});

app.patch('/api/profile', authMiddleware, async (req, res) => {
  const allowed = ['fullName', 'email', 'branchYear', 'college', 'phone', 'interests', 'location', 'bio'];
  const update = {};
  for (const k of allowed) if (k in req.body) update[k] = req.body[k];
  } else if (isInterestsBased) {
    // New interests-based scoring: ai_q*, web_q*, ds_q*, cyber_q*, mobile_q*, cloud_q*, devops_q*, uiux_q*, bc_q*
    for (const [key, val] of Object.entries(answers)) {
      if (key.startsWith("ai_q")) {
        // AI questions heavily favor Machine Learning
        scores["Machine Learning"] += 2;
        if (/expert|advanced|extensive|very high/i.test(String(val))) scores["Machine Learning"] += 1;
      } else if (key.startsWith("web_q")) {
        // Web Development questions favor Python (full-stack)
        scores.Python += 2;
        if (/backend|full-stack|node\.js|python/i.test(String(val))) scores.Python += 1;
        if (/database|sql/i.test(String(val))) scores.SQL += 1;
      } else if (key.startsWith("ds_q")) {
        // Data Science questions favor Machine Learning and SQL
        scores["Machine Learning"] += 2;
        scores.SQL += 1;
        if (/expert|advanced|strong/i.test(String(val))) scores["Machine Learning"] += 1;
      } else if (key.startsWith("cyber_q")) {
        // Cybersecurity questions favor Python (scripting/automation)
        scores.Python += 1;
        if (/scripting|python|automation/i.test(String(val))) scores.Python += 1;
      } else if (key.startsWith("mobile_q")) {
        // Mobile Apps favor Python (if using frameworks like Kivy/BeeWare) but more general
        scores.Python += 1;
      } else if (key.startsWith("cloud_q")) {
        // Cloud questions favor SQL (data management) and Python (automation)
        scores.SQL += 1;
        scores.Python += 1;
      } else if (key.startsWith("devops_q")) {
        // DevOps questions favor Python (automation) and SQL (infrastructure data)
        scores.Python += 1;
        scores.SQL += 1;
      } else if (key.startsWith("uiux_q")) {
        // UI/UX questions slightly favor Python (web frameworks)
        scores.Python += 1;
      } else if (key.startsWith("bc_q")) {
        // Blockchain questions favor Python (smart contract dev, web3)
        scores.Python += 2;
        if (/solidity|smart contract|web3/i.test(String(val))) scores.Python += 1;
      } else if (key === "exp_lvl") {
        if (val === "Beginner") scores.Python += 2;
        else if (val === "Intermediate") scores.SQL += 2;
        else if (val === "Advanced") scores["Machine Learning"] += 1;
      } else if (key === "time_commit") {
        if (val === "< 3 hrs/week") scores.Python += 1;
        else if (val === "3-6 hrs/week") scores.SQL += 1;
        else if (val === "> 6 hrs/week") scores["Machine Learning"] += 1;
      }
    }
  update.updatedAt = new Date();
  try {
  // Bias toward selected interests (if provided)
  if (Array.isArray(selectedInterests)) {
    for (const interest of selectedInterests) {
      if (interest === 'AI' || interest === 'Data Science') scores["Machine Learning"] += 1;
      if (interest === 'Web Development') scores.Python += 1;
      if (interest === 'DevOps' || interest === 'Cloud') {
        scores.Python += 1;
        scores.SQL += 1;
      }
      if (interest === 'Blockchain' || interest === 'Cybersecurity') scores.Python += 1;
      if (interest === 'Mobile Apps' || interest === 'UI/UX') scores.Python += 1;
    }
      { new: true, runValidators: true }
    ).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, __v, _id, ...publicFields } = user;
    res.json(publicFields);
  } catch (err) {
      subjectFocus: Array.isArray(selectedInterests) ? selectedInterests.join(', ') : null,
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: 'Failed to update profile', detail: err.message });
  }
});

app.post('/api/profile/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const urlPath = `/uploads/${req.file.filename}`;
  try {
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      { $set: { avatarUrl: urlPath, updatedAt: new Date() } },
      { new: true }
    ).lean();
    const { password, __v, _id, ...publicFields } = user;
    res.json(publicFields);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save avatar', detail: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
