# EduTech Skills Finder

A full-stack AI-powered educational platform for skill assessment, personalized learning paths, and mentor connections.

## 🚀 Features

- **AI-Powered Quiz**: Dynamic skill assessment with personalized recommendations
- **Smart Dashboard**: Real-time skill tracking, achievement badges, and learning analytics
- **Mentor Connect**: Book sessions with expert mentors and get personalized guidance
- **Career Path Generator**: AI-driven career recommendations based on your skills
- **Learning Roadmaps**: Structured learning paths for Python, SQL, and Machine Learning
- **Admin Portal**: Manage users, sessions, and platform content

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- OpenAI API (GPT-4)
- JWT Authentication

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "EduTech Skills Finder using Ai"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/edutech
   OPENAI_API_KEY=your_openai_api_key_here
   JWT_SECRET=your_secret_key_here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

   Seed the database:
   ```bash
   node seedMentors.js
   ```

   Start the backend:
   ```bash
   node server.js
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the `frontend` folder (optional):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

   Start the frontend:
   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📁 Project Structure

```
EduTech Skills Finder using Ai/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── data/            # Seed data
│   ├── uploads/         # User uploads
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── api/         # API integration
│       ├── components/  # React components
│       └── pages/       # Page components
└── README.md
```

## 🔑 Default Admin Credentials

- **Username**: admin
- **Password**: admin123

(Change these in production via environment variables)

## 🌟 Key Features Breakdown

### Quiz System
- Multi-domain skill assessment
- Interest-based questions
- AI-powered scoring and recommendations
- Persistent result tracking

### Dashboard
- Visual skill metrics
- Achievement badge system
- Weekly learning planner
- Skill trend analysis

### Mentor Connect
- Browse expert mentors
- Book 1-on-1 sessions
- Session-based Q&A
- Admin session management

### AI Integration
- GPT-4 powered chatbot
- Intelligent career path suggestions
- Personalized learning recommendations

## 🔒 Security

- JWT-based authentication
- Password hashing (bcrypt)
- Role-based access control (User/Admin)
- Environment variable configuration

## 📝 API Endpoints

### Auth
- POST `/api/register` - User registration
- POST `/api/login` - User login
- POST `/api/admin/register` - Admin registration
- POST `/api/admin/login` - Admin login

### Quiz & Results
- POST `/api/quiz` - Submit quiz answers
- GET `/api/my-results` - Get user results

### Profile
- GET `/api/profile` - Get user profile
- PATCH `/api/profile` - Update profile
- POST `/api/profile/avatar` - Upload avatar

### Mentors
- GET `/api/mentors` - List all mentors
- GET `/api/mentors/:id` - Get mentor details
- POST `/api/mentors/:id/book` - Book a session
- GET `/api/mentors/admin/all-sessions` - Admin: view all sessions

### AI
- POST `/api/ai-response` - Get AI chatbot response
- GET `/api/ai-health` - Check AI service status

## 🚀 Deployment

### Backend
1. Set production environment variables
2. Update MONGO_URI to production database
3. Deploy to services like Heroku, Railway, or Render

### Frontend
1. Build the production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or AWS S3

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Authors

- Your Name / Team

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- MongoDB for database
- React and Node.js communities

## 📧 Support

For issues and questions, please open an issue on GitHub or contact the maintainers.

---

**Note**: This project was created as part of an educational technology initiative to help students discover and develop their technical skills through AI-powered assessments and personalized learning paths.
