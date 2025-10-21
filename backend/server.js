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
const mentorRoutes = require('./routes/mentorRoutes');

const app = express();
app.use(cors({
  origin: true, // allow all origins during development
  methods: ["GET", "POST", "PATCH", "PUT", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

// Tiny request logger for debugging routes
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

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
  .then(async () => {
    console.log('MongoDB connected');
    // Ensure there is at least one admin user
    try {
      const existingAdmin = await User.findOne({ role: 'admin' }).lean();
      if (!existingAdmin) {
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const hash = bcrypt.hashSync(adminPassword, 10);
        await User.create({ username: adminUsername, password: hash, role: 'admin' });
        console.log('[INIT] Created default admin account');
        console.log(`[INIT] Admin username: ${adminUsername}`);
        console.log(`[INIT] Admin password: ${adminPassword}`);
      }
    } catch (e) {
      console.error('Failed to ensure default admin:', e?.message || e);
    }
  })
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
    req.user = { username: payload.username, role: payload.role || 'user' };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
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
    const user = new User({ username, password: hash, role: 'user' });
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
    const token = jwt.sign({ username, role: user.role || 'user' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, username, role: user.role || 'user' });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', detail: err.message });
  }
});

// Admin: Register (create first admin if none exists or allow by secret)
app.post('/api/admin/register', async (req, res) => {
  const { username, password, adminSecret } = req.body || {};
  if (!username || !password || password.length < 4) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  // optional: require ADMIN_SECRET to create admins
  const requiredSecret = process.env.ADMIN_SECRET;
  if (requiredSecret && adminSecret !== requiredSecret) {
    return res.status(403).json({ error: 'Invalid admin secret' });
  }
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: 'Username already exists' });
    const hash = bcrypt.hashSync(password, 10);
    const user = new User({ username, password: hash, role: 'admin' });
    await user.save();
    return res.json({ ok: true, message: 'Admin registered successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Admin registration failed', detail: err.message });
  }
});

// Admin: Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Invalid input' });
  try {
    const user = await User.findOne({ username, role: 'admin' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, username, role: 'admin' });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', detail: err.message });
  }
});

// Example admin-only endpoint
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 }).sort({ createdAt: -1 }).lean();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', detail: err.message });
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
// Expects: { answers: { ... }, selectedInterests: [...] }
// Returns: { scores: { Python: number, SQL: number, 'Machine Learning': number }, recommendations: string[], message: string }
app.post("/api/quiz", authMiddleware, async (req, res) => {
  const { answers, selectedInterests } = req.body || {};
  const scores = { Python: 0, SQL: 0, "Machine Learning": 0 };

  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Invalid payload. Provide { answers: {...} }" });
  }

  // Support three payload styles:
  // 1) Legacy: answers.q1..q5
  // 2) Subject-based: keys like python_q1, sql_q1, ml_q1, exp_lvl, time_commit
  // 3) Interests-based: keys like ai_q1, web_q1, ds_q1, cyber_q1, mobile_q1, cloud_q1, devops_q1, uiux_q1, bc_q1, exp_lvl, time_commit
  const keys = Object.keys(answers);
  const isLegacy = keys.some((k) => /^q[1-5]$/.test(k));
  const isInterestsBased = keys.some((k) => /^(ai|web|ds|cyber|mobile|cloud|devops|uiux|bc)_q\d+$/.test(k));

  // Calculate skill scores based on quiz answers
  const skillScores = {};
  
  // Helper function to calculate score from answer (0-100%)
  const calculateAnswerScore = (answer) => {
    const answerStr = String(answer || '').toLowerCase();
    if (/expert|advanced|extensive|very high|10\+|strong/i.test(answerStr)) return 90;
    if (/intermediate|comfortable|good|high|5-10|some projects/i.test(answerStr)) return 70;
    if (/beginner|basic|moderate|learning|2-5|heard of it/i.test(answerStr)) return 50;
    if (/none|low|new to me|< 2|not yet|not interested/i.test(answerStr)) return 30;
    return 60; // default middle score
  };

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
    // Legacy: basic skill scores
    skillScores["Coding"] = 65;
    skillScores["Logic"] = 60;
    skillScores["Problem Solving"] = 70;
  } else if (isInterestsBased) {
    // New interests-based scoring: ai_q*, web_q*, ds_q*, cyber_q*, mobile_q*, cloud_q*, devops_q*, uiux_q*, bc_q*
    const interestSkillMap = {
      ai: "AI & Machine Learning",
      web: "Web Development",
      ds: "Data Science",
      cyber: "Cybersecurity",
      mobile: "Mobile Development",
      cloud: "Cloud Computing",
      devops: "DevOps",
      uiux: "UI/UX Design",
      bc: "Blockchain"
    };

    // Track answers per interest to calculate average
    const interestAnswers = {};
    
    for (const [key, val] of Object.entries(answers)) {
      const match = key.match(/^(ai|web|ds|cyber|mobile|cloud|devops|uiux|bc)_q\d+$/);
      if (match) {
        const interest = match[1];
        const skillName = interestSkillMap[interest];
        const answerScore = calculateAnswerScore(val);
        
        if (!interestAnswers[skillName]) interestAnswers[skillName] = [];
        interestAnswers[skillName].push(answerScore);
        
        // Also update legacy scores for recommendations
        if (interest === "ai" || interest === "ds") {
          scores["Machine Learning"] += 2;
          if (/expert|advanced|extensive|very high/i.test(String(val))) scores["Machine Learning"] += 1;
        } else if (interest === "web") {
          scores.Python += 2;
          if (/backend|full-stack|node\.js|python/i.test(String(val))) scores.Python += 1;
          if (/database|sql/i.test(String(val))) scores.SQL += 1;
        } else if (interest === "cyber" || interest === "devops" || interest === "bc") {
          scores.Python += 1;
        } else if (interest === "cloud") {
          scores.SQL += 1;
          scores.Python += 1;
        }
      }
    }

    // Calculate average skill scores
    for (const [skillName, answerScores] of Object.entries(interestAnswers)) {
      const avg = answerScores.reduce((a, b) => a + b, 0) / answerScores.length;
      skillScores[skillName] = Math.round(avg);
    }

    // Add general skills based on common answers
    const expLevel = answers.exp_lvl;
    const timeCommit = answers.time_commit;
    
    if (expLevel) {
      skillScores["Coding"] = calculateAnswerScore(expLevel);
    }
    if (timeCommit) {
      skillScores["Problem Solving"] = calculateAnswerScore(timeCommit);
    }
    
    // Ensure we have at least 3 skills
    if (!skillScores["Coding"]) skillScores["Coding"] = 65;
    if (!skillScores["Logic"]) skillScores["Logic"] = 60;
    if (!skillScores["Problem Solving"]) skillScores["Problem Solving"] = 70;
  } else {
    // Subject-based scoring (old Quiz.jsx)
    for (const [key, val] of Object.entries(answers)) {
      if (key.startsWith("python_")) {
        scores.Python += 1;
        if (key === "python_q7" && /high/i.test(String(val))) scores.Python += 1;
        if (key === "python_q8" && /high/i.test(String(val))) scores.Python += 1;
        if (key === "python_q2" && typeof val === "string" && /a lot/i.test(val)) {
          scores.Python += 1;
        }
      } else if (key.startsWith("sql_")) {
        scores.SQL += 1;
        if (key === "sql_q3" && /often/i.test(String(val))) scores.SQL += 1;
        if (key === "sql_q4" && /high/i.test(String(val))) scores.SQL += 1;
        if (key === "sql_q7" && /yes/i.test(String(val))) scores.SQL += 1;
      } else if (key.startsWith("ml_")) {
        if (key === "ml_q2" && typeof val === "string") {
          if (/strong/i.test(val)) scores["Machine Learning"] += 2;
          else if (/average/i.test(val)) scores["Machine Learning"] += 1;
          else scores["Machine Learning"] += 0;
        } else {
          scores["Machine Learning"] += 1;
          if (key === "ml_q4" && /good/i.test(String(val))) scores["Machine Learning"] += 1;
          if (key === "ml_q7" && /high/i.test(String(val))) scores["Machine Learning"] += 1;
          if (key === "ml_q8" && /comfortable/i.test(String(val))) scores["Machine Learning"] += 1;
        }
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
  }

  // Bias toward selected interests (if provided)
  if (Array.isArray(selectedInterests) && selectedInterests.length > 0) {
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
  }

  // Build recommendations from top two
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topTwo = sorted.slice(0, 2).map(([n]) => n);
  const recs = [];
  if (topTwo.includes("Python")) recs.push("Python Basics", "Automate Boring Stuff", "NumPy & Pandas");
  if (topTwo.includes("SQL")) recs.push("SQL Joins & Aggregations", "Data Modeling", "BI Dashboards");
  if (topTwo.includes("Machine Learning")) recs.push("Supervised Learning", "Model Evaluation", "scikit-learn Projects");

  const message = `Top fit: ${sorted[0][0]}. Secondary: ${sorted[1] ? sorted[1][0] : "N/A"}.`;
  const maxPerTrack = 50; // increased to accommodate multiple interests with 10 questions each

  // Persist result for this user
  const username = req.user?.username || 'anonymous';
  try {
    await Result.create({
      username,
      subjectFocus: Array.isArray(selectedInterests) ? selectedInterests.join(', ') : null,
      answers,
      scores,
      message,
      recommendations: recs,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save result', detail: err.message });
  }

  // Update user profile with calculated skill scores
  try {
    const user = await User.findOne({ username });
    if (user) {
      // Convert skillScores object to array format for frontend
      const skillsArray = Object.entries(skillScores).map(([label, value]) => ({
        label,
        value
      }));
      user.skills = skillsArray;
      await user.save();
      console.log(`Updated skills for user ${username}:`, skillsArray);
    }
  } catch (err) {
    console.error('Failed to update user skills:', err);
    // Don't fail the request if skill update fails
  }

  return res.json({ 
    scores, 
    recommendations: recs, 
    message, 
    maxPerTrack, 
    skills: Object.entries(skillScores).map(([label, value]) => ({ label, value })) 
  });
});

// Profile endpoints
app.get('/api/me', authMiddleware, (req, res) => {
  return res.json({ username: req.user.username, role: req.user.role || 'user' });
});


app.get('/api/my-results', authMiddleware, async (req, res) => {
  const username = req.user.username;
  try {
    const results = await Result.find({ username }).sort({ timestamp: -1 });
    return res.json({ results });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch results', detail: err.message });
  }
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
  update.updatedAt = new Date();
  try {
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      { $set: update },
      { new: true, runValidators: true }
    ).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, __v, _id, ...publicFields } = user;
    res.json(publicFields);
  } catch (err) {
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
    // Always return avatarUrl for frontend compatibility
    res.json({ avatarUrl: urlPath });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save avatar', detail: err.message });
  }
});

app.use('/api/mentors', mentorRoutes);

// Simple ping
app.get('/api/ping', (req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT) || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  const addr = server.address();
  console.log(`Backend running on port ${PORT}`);
  if (addr && typeof addr === 'object') {
    console.log(`[LISTEN] address: ${addr.address} port: ${addr.port} family: ${addr.family}`);
  }
});
server.on('error', (err) => {
  console.error('[SERVER ERROR]', err?.code || err?.message || err);
});

/*
Default Admin Credentials (for development/testing)
Change these via environment variables ADMIN_USERNAME and ADMIN_PASSWORD in production.

  Username: admin
  Password: admin123
*/
