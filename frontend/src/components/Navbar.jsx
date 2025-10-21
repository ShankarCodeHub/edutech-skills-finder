import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaGraduationCap, FaHome, FaBookOpen, FaRobot, FaRocket } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  const sectionIds = useMemo(() => ["home", "dashboard", "courses", "chatbot"], []);
  const navItems = useMemo(
    () => [
      { id: "home", label: "Home", Icon: FaHome },
      { id: "dashboard", label: "Dashboard", Icon: FaRocket },
      { id: "courses", label: "Courses", Icon: FaBookOpen },
      { id: "chatbot", label: "Chatbot", Icon: FaRobot },
    ],
    []
  );

  const scrollToId = useCallback((id) => {
    // If clicking "dashboard", navigate to the dashboard route
    if (id === "dashboard") {
      navigate("/dashboard");
      setActive("dashboard");
      setOpen(false);
      return;
    }
    
    // If not on homepage, navigate to homepage first
    if (!isHomePage) {
      navigate("/home");
      // Wait for navigation, then scroll
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          if (typeof el.focus === "function") {
            el.focus({ preventScroll: true });
          }
        }
      }, 100);
      setActive(id);
      setOpen(false);
      return;
    }
    
    // On homepage, scroll directly
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof el.focus === "function") {
        el.focus({ preventScroll: true });
      }
      setActive(id);
      setOpen(false);
    }
  }, [isHomePage, navigate]);

  useEffect(() => {
    // Set active state based on current route
    if (location.pathname === "/dashboard") {
      setActive("dashboard");
      return;
    }
    
    const onScroll = () => {
      // Only track scroll on home page
      if (!isHomePage) return;
      
      // Determine the currently visible section
      const y = 120; // offset from top to account for navbar height
      let current = active;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= y && rect.bottom >= y) {
          current = id;
          break;
        }
      }
      if (current !== active) setActive(current);
    };

    const onHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && sectionIds.includes(hash)) setActive(hash);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHash);
    onHash();
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHash);
    };
  }, [active, sectionIds, location.pathname, isHomePage]);

  const NavLink = ({ id, Icon, children }) => {
    const isActive = active === id;
    return (
      <button
        type="button"
        onClick={() => scrollToId(id)}
        className={`group relative inline-flex items-center gap-2 px-2 py-1 font-semibold transition-colors ${
          isActive ? "text-purple-900" : "text-purple-700 hover:text-purple-900"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
        {children}
        <span
          className={`pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-purple-500 to-purple-700 transition-transform duration-300 ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 mb-4 rounded-2xl border border-purple-200/60 bg-white/60 backdrop-blur-xl shadow-sm">
          {/* gradient bottom border */}
          <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400 opacity-40" />
          <div className="flex items-center justify-between px-4 py-3">
            {/* Brand */}
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => {
                if (!isHomePage) {
                  navigate("/home");
                } else {
                  scrollToId("home");
                }
              }}
              aria-label="EduTech Skills Finder - Home"
            >
              <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-md shadow-purple-600/30">
                <FaGraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                EduTech Skills Finder
              </span>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map(({ id, label, Icon }) => (
                <NavLink key={id} id={id} Icon={Icon}>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="hidden md:inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-600/20 transition hover:shadow-lg hover:shadow-purple-700/30 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                onClick={() => {
                  if (isHomePage) {
                    scrollToId('dashboard');
                  } else {
                    navigate('/dashboard');
                  }
                }}
              >
                <FaRocket className="h-4 w-4" aria-hidden="true" />
                Get Started
              </button>
              {localStorage.getItem('auth_token') ? (
                <button
                  type="button"
                  className="hidden md:inline-flex items-center justify-center gap-2 rounded-lg border border-purple-300/60 px-4 py-2 text-sm font-semibold text-purple-800 bg-white/70 backdrop-blur-md"
                  onClick={() => navigate('/profile')}
                >
                  My Profile
                </button>
              ) : null}
              {(() => {
                try {
                  const info = JSON.parse(localStorage.getItem('student_logged_in') || 'null');
                  if (info?.role === 'admin') {
                    return (
                      <button
                        type="button"
                        className="hidden md:inline-flex items-center justify-center gap-2 rounded-lg border border-purple-300/60 px-4 py-2 text-sm font-semibold text-purple-800 bg-white/70 backdrop-blur-md"
                        onClick={() => navigate('/admin')}
                      >
                        Admin
                      </button>
                    );
                  }
                } catch {}
                return null;
              })()}
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="md:hidden relative h-10 w-10 rounded-xl border border-purple-300/60 bg-white/70 backdrop-blur-md shadow-sm"
              >
                <span
                  className={`absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 -translate-y-2 rounded bg-purple-800 transition ${
                    open ? "translate-y-0 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 rounded bg-purple-800 transition ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 translate-y-2 rounded bg-purple-800 transition ${
                    open ? "-translate-y-0 -rotate-45" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden px-4 pb-4 origin-top transition-all duration-300 ${
              open ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 h-0"
            }`}
            style={{ transformOrigin: "top" }}
          >
            <div className="flex flex-col gap-2">
              {navItems.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToId(id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold transition-colors ${
                    active === id
                      ? "bg-purple-100 text-purple-900"
                      : "text-purple-700 hover:bg-purple-50 hover:text-purple-900"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
              {localStorage.getItem('auth_token') ? (
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-purple-300/60 px-4 py-2 text-sm font-semibold text-purple-800 bg-white/70 backdrop-blur-md"
                >
                  My Profile
                </button>
              ) : null}
              {(() => {
                try {
                  const info = JSON.parse(localStorage.getItem('student_logged_in') || 'null');
                  if (info?.role === 'admin') {
                    return (
                      <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-purple-300/60 px-4 py-2 text-sm font-semibold text-purple-800 bg-white/70 backdrop-blur-md"
                      >
                        Admin
                      </button>
                    );
                  }
                } catch {}
                return null;
              })()}
              <button
                type="button"
                onClick={() => {
                  if (isHomePage) {
                    scrollToId('dashboard');
                  } else {
                    navigate('/dashboard');
                  }
                }}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-600/20"
              >
                <FaRocket className="h-4 w-4" aria-hidden="true" />
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
