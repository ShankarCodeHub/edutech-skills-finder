const mongoose = require('mongoose');


const QASchema = new mongoose.Schema({
  user: String,
  text: String,
  reply: String,
  createdAt: { type: Date, default: Date.now }
});

const SessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true },
  user: String, // username or id
  name: String,
  email: String,
  phone: String,
  location: String,
  college: String,
  photo: String, // URL or path
  bio: String,
  date: String,
  time: String,
  topic: String,
  qa: [QASchema],
  createdAt: { type: Date, default: Date.now }
});

const MentorSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  expertise: String,
  avatar: String,
  bio: String,
  sessions: [SessionSchema]
});

module.exports = mongoose.model('Mentor', MentorSchema);
