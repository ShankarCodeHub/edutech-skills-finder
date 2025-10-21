import React from "react";

export default function Privacy() {
  return (
    <section className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-purple-700 text-center">Privacy Policy</h1>
      <div className="relative bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-8 mb-12">
        {/* Decorative gradient blob */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-purple-400/30 blur-[60px] animate-blob" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 w-24 h-24 rounded-full bg-purple-300/30 blur-[40px] animate-blob delay-2000" />
        <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-300 text-white grid place-items-center font-bold mr-2">1</span>
          Data Protection
        </h2>
        <ul className="list-disc ml-8 space-y-3 text-purple-900 text-lg">
          <li>We value your privacy and protect your data.</li>
          <li>No third-party sharing or selling.</li>
          <li>Data is encrypted and securely stored.</li>
        </ul>
      </div>
      <div className="relative bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-8 mb-12">
        <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-300 text-white grid place-items-center font-bold mr-2">2</span>
          Cookies & Usage
        </h2>
        <ul className="list-disc ml-8 space-y-3 text-purple-900 text-lg">
          <li>Only essential cookies used for site functionality.</li>
          <li>No tracking or advertising cookies.</li>
        </ul>
      </div>
      <div className="relative bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-8 mb-12">
        <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-300 text-white grid place-items-center font-bold mr-2">3</span>
          Contact
        </h2>
        <ul className="list-disc ml-8 space-y-3 text-purple-900 text-lg">
          <li>For privacy concerns, contact us at <a href="mailto:umakashyap344@gmail.com" className="text-purple-600 underline">umakashyap344@gmail.com</a>.</li>
        </ul>
      </div>
    </section>
  );
}
