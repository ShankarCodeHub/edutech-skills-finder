const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Middleware to get user from JWT
function getUser(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    return payload.username;
  } catch {
    return null;
  }
}

// Get mentor profile, bookings, and Q&A
// List mentors (basic info)
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.find({}, { _id: 0, __v: 0 }).lean();
    res.json(mentors);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load mentors' });
  }
});

// Get mentor profile, bookings, and Q&A by id
router.get('/:id', async (req, res) => {
  const mentor = await Mentor.findOne({ id: req.params.id });
  if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
  res.json(mentor);
});


// Book a session (creates a new session with unique sessionId and student details)
router.post('/:id/book', async (req, res) => {
  const mentor = await Mentor.findOne({ id: req.params.id });
  if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
  const user = getUser(req) || 'guest';
  const { name, email, phone, location, college, photo, bio, date, time, topic } = req.body;
  if (!date || !topic || !name || !email) return res.status(400).json({ error: 'Missing required fields' });
  // Generate a unique session id using built-in crypto
  const sessionId = crypto.randomUUID();
  mentor.sessions.push({
    sessionId,
    user,
    name,
    email,
    phone,
    location,
    college,
    photo,
    bio,
    date,
    time,
    topic,
    qa: []
  });
  await mentor.save();
  res.json({ ok: true, sessionId });
});

// List all sessions for a mentor
router.get('/:id/sessions', async (req, res) => {
  const mentor = await Mentor.findOne({ id: req.params.id });
  if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
  res.json(mentor.sessions.map(({ sessionId, user, date, topic, createdAt }) => ({ sessionId, user, date, topic, createdAt })));
});

// Get session details (Q&A)
router.get('/:id/session/:sessionId', async (req, res) => {
  const mentor = await Mentor.findOne({ id: req.params.id });
  if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
  const session = mentor.sessions.find(s => s.sessionId === req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// Post a question to a session
router.post('/:id/session/:sessionId/question', async (req, res) => {
  const mentor = await Mentor.findOne({ id: req.params.id });
  if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
  const session = mentor.sessions.find(s => s.sessionId === req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const user = getUser(req) || 'guest';
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing question text' });
  session.qa.push({ user, text });
  await mentor.save();
  res.json({ ok: true });
});

// Reply to a question in a session (by index)
router.post('/:id/session/:sessionId/reply', async (req, res) => {
  const mentor = await Mentor.findOne({ id: req.params.id });
  if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
  const session = mentor.sessions.find(s => s.sessionId === req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const { index, reply } = req.body;
  if (typeof index !== 'number' || !reply) return res.status(400).json({ error: 'Missing index or reply' });
  if (!session.qa[index]) return res.status(404).json({ error: 'Question not found' });
  session.qa[index].reply = reply;
  await mentor.save();
  res.json({ ok: true });
});

// Submit a question
router.post('/:id/question', async (req, res) => {
  const mentor = await Mentor.findOne({ id: req.params.id });
  if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
  const user = getUser(req) || 'guest';
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing question text' });
  mentor.qa.push({ user, text });
  await mentor.save();
  res.json({ ok: true });
});

// Reply to a question (by index)
router.post('/:id/reply', async (req, res) => {
  const mentor = await Mentor.findOne({ id: req.params.id });
  if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
  const { index, reply } = req.body;
  if (typeof index !== 'number' || !reply) return res.status(400).json({ error: 'Missing index or reply' });
  if (!mentor.qa[index]) return res.status(404).json({ error: 'Question not found' });
  mentor.qa[index].reply = reply;
  await mentor.save();
  res.json({ ok: true });
});

// Admin: List all sessions with student details and mentor info
router.get('/admin/all-sessions', async (req, res) => {
  try {
    const mentors = await Mentor.find({}).lean();
    const allSessions = [];
    mentors.forEach(mentor => {
      (mentor.sessions || []).forEach(session => {
        allSessions.push({
          mentorId: mentor.id,
          mentorName: mentor.name,
          ...session
        });
      });
    });
    res.json(allSessions);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load sessions' });
  }
});

module.exports = router;
