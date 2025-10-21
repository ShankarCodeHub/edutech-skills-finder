import React from "react";
import { FaLinkedin, FaTwitter, FaGithub, FaInfoCircle, FaShieldAlt, FaGavel, FaLifeRing } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative w-full text-white py-16 px-3 mt-12 flex flex-col items-center overflow-hidden" style={{background: 'linear-gradient(135deg, #8458B3 0%, #6a4fb6 50%, #3c2a6b 100%)'}}>
      {/* Animated gradient blobs for glass effect */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-400/30 blur-[90px] animate-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-300/30 blur-[90px] animate-blob delay-2000" />
      <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-purple-400/15 via-purple-300/10 to-purple-500/15 blur-2xl -z-10" />
      <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-10 z-10">

        {/* About Section */}
        <div className="flex-1 min-w-[220px]">
          <h3 className="flex items-center gap-2 text-2xl font-extrabold mb-3 text-purple-100 drop-shadow"><FaInfoCircle className="text-purple-300" /> About EduTech</h3>
          <p className="text-purple-100/90 text-base mb-2">EduTech Skill Finder is your personalized gateway to tech learning. Powered by AI, it recommends skills, courses, and roadmaps tailored for you. Perfect for beginners and upskilling pros. Accelerate your career with expert mentorship and curated content.</p>
          <Link to="/about" className="inline-block mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow hover:scale-105 transition">Learn More</Link>
        </div>

        {/* Quick Links - Centered and Vertical */}
        <div className="flex-1 text-center min-w-[220px]">
          <h4 className="text-xl font-bold mb-3 text-purple-100">Quick Links</h4>
          <nav className="flex flex-col items-center gap-4 text-white font-semibold">
            <Link to="/about" className="flex items-center gap-2 hover:text-purple-300 transition"><FaInfoCircle /> About</Link>
            <Link to="/privacy" className="flex items-center gap-2 hover:text-purple-300 transition"><FaShieldAlt /> Privacy Policy</Link>
            <Link to="/terms" className="flex items-center gap-2 hover:text-purple-300 transition"><FaGavel /> Terms & Conditions</Link>
            <Link to="/support" className="flex items-center gap-2 hover:text-purple-300 transition"><FaLifeRing /> Support</Link>
          </nav>
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-[220px]">
          <h4 className="text-xl font-bold mb-3 text-purple-100">Contact Info</h4>
          <ul className="text-purple-100/90 text-base space-y-1">
            <li><span className="font-semibold">Email:</span> <a href="mailto:umakashyap344@gmail.com" className="hover:text-purple-300 transition">umakashyap344@gmail.com</a></li>
            <li><span className="font-semibold">Phone:</span> <a href="tel:+918969343591" className="hover:text-purple-300 transition">+91 8969 343591</a></li>
            <li><span className="font-semibold">Address:</span> Patna, India</li>
          </ul>
          <div className="flex gap-5 mt-3">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition"><FaLinkedin size={24} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition"><FaTwitter size={24} /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition"><FaGithub size={24} /></a>
          </div>
        </div>
      </div>

      <div className="w-full mt-8 border-t border-purple-400/40 pt-4 flex flex-col md:flex-row items-center justify-center gap-6 text-purple-100 text-sm z-10">
        <Link to="/privacy" className="flex items-center gap-1 hover:text-purple-300 transition"><FaShieldAlt /> Privacy Policy</Link>
        <span className="hidden md:inline">|</span>
        <Link to="/terms" className="flex items-center gap-1 hover:text-purple-300 transition"><FaGavel /> Terms & Conditions</Link>
        <span className="hidden md:inline">|</span>
        <Link to="/support" className="flex items-center gap-1 hover:text-purple-300 transition"><FaLifeRing /> Support</Link>
        <span className="hidden md:inline">|</span>
        <span>&copy; 2025 EduTech Skill Finder. All rights reserved.</span>
      </div>

      {/* Local keyframes for blobs */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.08); }
          66% { transform: translate(-20px, 25px) scale(0.95); }
        }
        .animate-blob { animation: blob 9s ease-in-out infinite; }
        .delay-2000 { animation-delay: 2s; }
      `}</style>
    </footer>
  );
}
