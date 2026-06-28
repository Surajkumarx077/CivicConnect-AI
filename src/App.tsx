/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Auth } from "./pages/Auth";
import { MapExplorer } from "./pages/MapExplorer";
import { Analytics } from "./pages/Analytics";
import { AuthProvider, useAuth } from "./store/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

function Splash() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900 font-sans p-6">
      <div className="max-w-xl text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-4">Google Maps API Key Required</h2>
        <p className="mb-4"><strong>Step 1:</strong> <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Get an API Key</a></p>
        <p className="mb-2"><strong>Step 2:</strong> Add your key as a secret in AI Studio:</p>
        <ul className="text-left leading-relaxed list-disc list-inside mb-6 text-gray-700">
          <li>Open <strong>Settings</strong> (⚙️ gear icon, <strong>top-right corner</strong>)</li>
          <li>Select <strong>Secrets</strong></li>
          <li>Type <code className="bg-gray-100 px-1 py-0.5 rounded">GOOGLE_MAPS_PLATFORM_KEY</code> as the secret name, press <strong>Enter</strong></li>
          <li>Paste your API key as the value, press <strong>Enter</strong></li>
        </ul>
        <p className="text-sm text-gray-500">The app rebuilds automatically after you add the secret.</p>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col font-sans overflow-hidden text-slate-900 relative">
      {/* Header: Geometric Precision */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-50">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-2 text-slate-500 hover:text-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center hidden sm:flex">
              <div className="w-4 h-4 border-2 border-white rotate-45"></div>
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-slate-800">
              CivicConnect <span className="text-blue-600">AI</span>
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <Link to="/dashboard" className="text-blue-600 border-b-2 border-transparent hover:border-blue-600 h-16 flex items-center transition-colors">
            Dashboard
          </Link>
          <Link to="/map" className="hover:text-slate-800 border-b-2 border-transparent hover:border-slate-800 h-16 flex items-center transition-colors">
            Map Explorer
          </Link>
          <Link to="/admin" className="hover:text-slate-800 border-b-2 border-transparent hover:border-slate-800 h-16 flex items-center transition-colors">
            Admin
          </Link>
          <Link to="/analytics" className="hover:text-slate-800 border-b-2 border-transparent hover:border-slate-800 h-16 flex items-center transition-colors">
            Analytics
          </Link>
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-400">{currentUser.email}</p>
                <button onClick={logout} className="text-xs text-blue-600 hover:underline">Sign Out</button>
              </div>
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              ) : (
                <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-500">
                    {currentUser.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors font-bold text-xs uppercase tracking-wider">
              Sign In
            </a>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-40 md:hidden flex flex-col p-4 gap-4">
          <Link to="/dashboard" className="font-medium text-slate-800 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
          <Link to="/map" className="font-medium text-slate-800 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Map Explorer</Link>
          <Link to="/admin" className="font-medium text-slate-800 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          <Link to="/analytics" className="font-medium text-slate-800 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Analytics</Link>
          <hr className="border-slate-100" />
          {currentUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
                ) : (
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500">{currentUser.email?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <span className="text-sm text-slate-600">{currentUser.email}</span>
              </div>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-sm font-medium text-red-600">Sign Out</button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-slate-900 text-white rounded text-center text-sm font-bold uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}

      {/* Main Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {children}
      </main>

      {/* Footer: System Information */}
      <footer className="h-auto md:h-10 bg-slate-900 text-slate-400 px-4 md:px-6 py-2 md:py-0 flex flex-col md:flex-row items-center justify-between text-[10px] shrink-0 gap-2 md:gap-0 z-10 relative">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>GCP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>FIRESTORE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="hidden sm:inline">GEMINI VISION 1.5 PRO</span>
            <span className="sm:hidden">GEMINI</span>
          </div>
        </div>
        <div className="tracking-widest uppercase text-center md:text-right w-full md:w-auto border-t border-slate-700 md:border-none pt-2 md:pt-0 mt-1 md:mt-0">
          Load: <span className="text-white">0.02ms</span> | Nodes: <span className="text-white">32</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/map" element={<MapExplorer />} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><div className="p-8 w-full max-w-2xl mx-auto"><h2 className="text-2xl font-bold mb-4">Report an Issue</h2><p>Form placeholder...</p></div></ProtectedRoute>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

