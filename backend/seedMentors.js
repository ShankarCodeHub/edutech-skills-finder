// Script to seed mentors into MongoDB for Mentor Connect
const mongoose = require('mongoose');
const Mentor = require('./models/Mentor');

const mentors = [
  {
    id: 'alice',
    name: 'Dr. Alice Smith',
    expertise: 'AI & Data Science',
    avatar: '🧑‍🔬',
    bio: 'PhD in AI, 10+ years teaching Data Science.',
    sessions: []
  },
  {
    id: 'john',
    name: 'Mr. John Doe',
    expertise: 'Web Development',
    avatar: '🧑‍💻',
    bio: 'Full-stack developer, React & Node.js expert.',
    sessions: []
  },
  {
    id: 'priya',
    name: 'Ms. Priya Patel',
    expertise: 'Cloud & DevOps',
    avatar: '🧑‍🚀',
    bio: 'Cloud architect, AWS certified, DevOps mentor.',
    sessions: []
  }
];

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/edutech', { useNewUrlParser: true, useUnifiedTopology: true });
  await Mentor.deleteMany({});
  await Mentor.insertMany(mentors);
  console.log('Mentors seeded!');
  mongoose.disconnect();
}

seed();
