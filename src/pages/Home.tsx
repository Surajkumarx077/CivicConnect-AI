import React from "react";
import { Link } from "react-router";
import { dummyReports } from "../data/dummyReports";
import { ReportCard } from "../components/reports/ReportCard";

export function Home() {
  const trendingReports = dummyReports.sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
  const recentReports = dummyReports.sort((a, b) => a.timeAgo.localeCompare(b.timeAgo)).slice(0, 3);
  const nearbyReports = dummyReports.slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-8 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-600 flex items-center justify-center mb-8">
            <div className="w-8 h-8 border-4 border-white rotate-45"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Empowering Citizens, <br className="hidden md:block" />
            <span className="text-blue-400">Building Better Cities.</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed mb-8">
            CivicConnect AI uses advanced Gemini Vision intelligence to analyze, route, and resolve civic issues faster than ever. Report potholes, leaks, and hazards with just a photo.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/report" className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold text-sm tracking-wide hover:bg-blue-700 transition-colors uppercase shadow-lg shadow-blue-500/30">
              Report an Issue
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 font-bold text-sm tracking-wide hover:bg-slate-100 transition-colors uppercase border border-slate-200">
              Explore Map
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-12 space-y-16">
        {/* Trending Issues */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">🔥 Trending Issues</h2>
            <Link to="/dashboard" className="text-[10px] font-black uppercase text-blue-600 tracking-widest hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </section>

        {/* Nearby Issues */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">📍 Nearby Issues (Midtown)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {nearbyReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </section>

        {/* Recent Reports */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">⏱️ Recent Reports</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </section>
      </div>

      {/* Floating Report Button */}
      <Link 
        to="/report" 
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:bg-blue-700 transition-transform hover:scale-105 z-50 group"
      >
        <span className="text-2xl leading-none">+</span>
        <span className="absolute right-16 bg-slate-900 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          New Report
        </span>
      </Link>
    </div>
  );
}
