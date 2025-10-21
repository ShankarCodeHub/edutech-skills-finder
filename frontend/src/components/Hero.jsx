import React from "react";

export default function Hero() {
  const scrollToDashboard = () => {
    const el = document.getElementById("dashboard");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof el.focus === "function") {
        el.focus({ preventScroll: true });
      }
    }
  };

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden rounded-3xl shadow-2xl mb-14 px-6 md:px-12 py-16 md:py-20 bg-gradient-to-br from-purple-50 via-white to-purple-100"
    >
      {/* Gradient mesh background blobs */}
      <div className="pointer-events-none absolute -top-28 -left-16 w-80 h-80 rounded-full bg-purple-300/60 blur-[80px] mix-blend-multiply animate-blob" />
      <div className="pointer-events-none absolute top-10 -right-10 w-64 h-64 rounded-full bg-purple-400/50 blur-[70px] mix-blend-multiply animate-blob delay-2000" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-purple-200/60 blur-[70px] mix-blend-multiply animate-blob delay-4000" />

      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(132,88,179,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(132,88,179,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px, 24px 24px",
          backgroundPosition: "-12px -12px, -12px -12px",
          maskImage: "radial-gradient(circle at 50% 50%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black, transparent 75%)",
        }}
      />

      <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Text content */}
        <div className="relative">
          {/* Accent badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/60 bg-white/60 px-4 py-1.5 backdrop-blur-md shadow-sm">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm font-medium text-purple-700">AI-powered learning guidance</span>
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 bg-clip-text text-transparent drop-shadow-md">
              Find the Right Skills for Your Future
            </span>
            <span className="block text-purple-800/90">with AI</span>
          </h1>

          <p className="mt-5 text-lg md:text-xl text-purple-700/90 max-w-xl">
            Personalized recommendations, roadmaps, and curated courses to accelerate your learning journey.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToDashboard}
              aria-label="Get started: jump to your dashboard"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-purple-600 to-purple-500 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-600/20 transition-all duration-300 hover:shadow-purple-700/30 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            >
              <span className="relative z-10">Get Started</span>
              {/* Shine */}
              <span className="pointer-events-none absolute left-[-150%] top-0 h-full w-1/2 bg-gradient-to-r from-white/0 via-white/60 to-white/0 opacity-40 blur-md animate-shine" />
            </button>
            <div className="text-sm text-purple-700/80">
              No signup required • Free to try
            </div>
          </div>
        </div>

        {/* Right: Visual card */}
        <div className="relative flex justify-center">
          {/* Glow ring */}
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-purple-400/30 via-purple-300/20 to-purple-500/30 blur-2xl opacity-70" />

          <div className="relative group w-[22rem] h-[22rem] rounded-3xl overflow-hidden bg-white/60 backdrop-blur-xl border border-purple-200/60 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <img
              src="https://img.freepik.com/premium-photo/teenager-student-girl-yellow-pointing-finger-side_1368-40175.jpg"
              alt="Hero Banner"
              className="absolute inset-0 h-full w-full object-cover transform transition-transform duration-[900ms] group-hover:scale-110 group-hover:rotate-1"
              loading="lazy"
            />
            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-purple-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Floating badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 text-purple-800 backdrop-blur-md shadow-md">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold">Smart Quiz Ready</span>
              </div>
              <span className="text-xs font-medium text-purple-700">2 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={scrollToDashboard}
        aria-label="Scroll to dashboard"
        className="absolute left-1/2 -translate-x-1/2 bottom-4 inline-flex items-center gap-2 text-purple-700/70 hover:text-purple-800 transition-colors"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-purple-700/70" />
        <span className="text-sm font-medium">Scroll to dashboard</span>
        <span className="animate-bounce-slow">↓</span>
      </button>

      {/* Keyframes and custom utilities */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.08); }
          66% { transform: translate(-20px, 25px) scale(0.95); }
        }
        .animate-blob { animation: blob 9s ease-in-out infinite; }
        .delay-2000 { animation-delay: 2s; }
        .delay-4000 { animation-delay: 4s; }

        @keyframes shine-slide {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(250%); }
        }
        .animate-shine { animation: shine-slide 2.2s linear infinite; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow { animation: bounce-slow 1.6s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
