// backend/models/Result.js
const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  username: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  subjectFocus: { type: String },
  answers: { type: Object, required: true },
  scores: { type: Object, required: true },
  message: { type: String },
  recommendations: { type: [String] },
});

module.exports = mongoose.model('Result', ResultSchema);