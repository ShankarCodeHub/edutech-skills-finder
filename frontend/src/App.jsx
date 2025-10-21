import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import { Outlet } from 'react-router-dom';
import Roadmap from './components/Roadmap.jsx';
import DashboardV2 from './components/DashboardV2.jsx';
import PythonDetails from './pages/PythonDetails';
import SQLDetails from './pages/SQLDetails';
import MLDetails from './pages/MLDetails';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import PythonRoadmap from './pages/PythonRoadmap';
import SQLRoadmap from './pages/SQLRoadmap';
import MLRoadmap from './pages/MLRoadmap';
import BackendStatusBanner from './components/BackendStatusBanner.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminRegister from './pages/AdminRegister.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import LandingChooser from './pages/LandingChooser.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import MentorProfile from './components/MentorProfile.jsx';
import MentorSession from './components/MentorSession.jsx';
import AdminSessions from './pages/AdminSessions.jsx'; // Import the AdminSessions component


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<LandingChooser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          {/* Layout route for main pages */}
          <Route element={<MainLayout />}> 
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/dashboard" element={<DashboardV2 />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/python" element={<PythonDetails />} />
            <Route path="/sql" element={<SQLDetails />} />
            <Route path="/machine-learning" element={<MLDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/support" element={<Support />} />
            <Route path="/python-roadmap" element={<PythonRoadmap />} />
            <Route path="/sql-roadmap" element={<SQLRoadmap />} />
            <Route path="/ml-roadmap" element={<MLRoadmap />} />
            <Route path="/mentors/:mentorId" element={<MentorProfile />} />
            <Route path="/mentors/:mentorId/session/:sessionId" element={<MentorSession />} />
            <Route path="/admin-sessions" element={<AdminSessions />} /> {/* New route for admin sessions */}
          </Route>
        </Routes>
      </div>
    </Router>
  );

}

function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <BackendStatusBanner />
    </>
  );
}

export default App;
