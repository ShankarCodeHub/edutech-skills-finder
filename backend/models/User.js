// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // auth
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
  // profile
  fullName: { type: String },
  email: { type: String, index: { unique: true, sparse: true } },
  branchYear: { type: String }, // e.g., "CSE 2nd Year"
  college: { type: String },
  phone: { type: String },
  interests: { type: [String], default: [] },
  location: { type: String },
  bio: { type: String },
  avatarUrl: { type: String },
  // dashboard fields
  skills: { type: Array, default: [] },
  badges: { type: Array, default: [] },
  careerPaths: { type: Array, default: [] },
  learningMap: { type: Array, default: [] },
  messages: { type: Array, default: [] },
  trends: { type: Array, default: [] },
  mentors: { type: Array, default: [] },
  planner: { type: Object, default: {} },
  // meta
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', UserSchema);