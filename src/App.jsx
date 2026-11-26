
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from 'react-router-dom';

import MatcherPage from './pages/MatcherPage';
import CoachPage from './pages/CoachPage';
import PlannerPage from './pages/PlannerPage';
import AdoptionPage from './pages/AdoptionPage';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import MyListings from './pages/MyListings';
import AddPetListing from './pages/AddPetList';

// Backend API connection
// Replace line 20:
const API_BASE = (
  import.meta.env.VITE_API_URL || 'https://paw-some-pet.onrender.com'
).replace(/\/+$/, '');

const API_BASE_URL = `${API_BASE}/api/ai`;


// Common function to communicate with Gemini through Express
async function callAI(endpoint, body = {}) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'AI request failed');
  }

  return data.text;
}

function NavigationWrapper() {
  const navigate = useNavigate();

  // Authentication state
  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('authUser')) || null;
    } catch {
      return null;
    }
  });

  // Update authentication state after login/logout
  useEffect(() => {
    const updateAuthUser = () => {
      try {
        setAuthUser(
          JSON.parse(sessionStorage.getItem('authUser')) || null
        );
      } catch {
        setAuthUser(null);
      }
    };

    window.addEventListener('auth-change', updateAuthUser);

    return () => {
      window.removeEventListener('auth-change', updateAuthUser);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('adminToken');

    setAuthUser(null);
    navigate('/login');
  };

  // Shared Global States
  const [profile, setProfile] = useState({
    housing: 'Apartment',
    workHours: 'Remote (0-2 hours away)',
    activityLevel: 'Moderate walks',
    hasChildren: 'No',
    experience: 'Beginner'
  });

  const [matchResult, setMatchResult] = useState(null);
  const [plannerResult, setPlannerResult] = useState(null);

  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [isPlannerLoading, setIsPlannerLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Pet Adaptation Coach. How can I help you train your new pet today?'
    }
  ]);

  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // 1. Lifestyle Quiz Action - Pet Matcher
  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    setIsMatchLoading(true);
    setMatchResult(null);

    try {
      const result = await callAI('match', {
        profile: profile
      });

      setMatchResult(result);

    } catch (err) {
      console.error('Matcher Error:', err);

      setMatchResult(`API Error: ${err.message}`);

    } finally {
      setIsMatchLoading(false);
    }
  };

  // 2. Chat Assistant Action - Live Coach
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!chatInput.trim() || isChatLoading) return;

    const txt = chatInput;

    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: txt
      }
    ]);

    setChatInput('');
    setIsChatLoading(true);

    try {
      const result = await callAI('chat', {
        message: txt
      });

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: result
        }
      ]);

    } catch (err) {
      console.error('Chat Error:', err);

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Connection Error: ${err.message}`
        }
      ]);

    } finally {
      setIsChatLoading(false);
    }
  };

  // 3. Seven-Day Routine Action - Planner
  const generateSevenDayPlan = async () => {
    setIsPlannerLoading(true);
    setPlannerResult(null);

    try {
      const result = await callAI('planner');

      setPlannerResult(result);

    } catch (err) {
      console.error('Planner Error:', err);

      setPlannerResult(`API Error: ${err.message}`);

    } finally {
      setIsPlannerLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs sticky top-0 z-50">

        {/* Logo */}
        <div className="flex items-center gap-2.5">

          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-xs">
            <span className="text-xl text-white">🐾</span>
          </div>

          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight block">
              PawsomeAdapt
            </span>

            <span className="text-xs text-slate-400 font-medium block">
              AI Behavior Routers
            </span>
          </div>

        </div>

        {/* Main Navigation Links */}
        <div className="flex flex-wrap justify-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">

          <Link
            to="/"
            className="px-4 py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-800 focus:bg-white focus:text-slate-900 focus:shadow-xs"
          >
            📋 Matcher
          </Link>

          <Link
            to="/coach"
            className="px-4 py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-800 focus:bg-white focus:text-slate-900 focus:shadow-xs"
          >
            💬 Live Coach
          </Link>

          <Link
            to="/planner"
            className="px-4 py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-800 focus:bg-white focus:text-slate-900 focus:shadow-xs"
          >
            📅 7-Day Planner
          </Link>

          <Link
            to="/adoption"
            className="px-4 py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-800 focus:bg-white focus:text-slate-900 focus:shadow-xs"
          >
            🐾 Adopt
          </Link>

        </div>

        {/* User Account and Additional Links */}
        <div className="flex flex-wrap items-center justify-center gap-3">

          <div className="flex items-center bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full">
            UN SDG 11 Framework
          </div>

          {authUser ? (
            <div className="flex items-center gap-2">

              <span className="text-sm font-bold text-slate-700">
                Hi, {authUser.name}
              </span>

              {authUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-xs font-bold bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100"
              >
                Logout
              </button>

            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Login / Register
            </Link>
          )}

          {/* Owner, Rescuer and Shelter Links */}
          {authUser &&
            ['owner', 'rescuer', 'shelter'].includes(authUser.role) && (
              <>
                <Link
                  to="/my-listings"
                  className="px-4 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-800"
                >
                  📋 My Listings
                </Link>

                <Link
                  to="/add-pet"
                  className="px-4 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-800"
                >
                  ➕ Add Pet
                </Link>
              </>
            )}

        </div>

      </nav>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto p-4 md:p-6 grid lg:grid-cols-4 gap-6 flex-1 items-start">

        {/* Sidebar */}
        <section className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">

          <h1 className="text-xl font-black text-slate-900">
            Routing Environment
          </h1>

          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-xs text-emerald-700 font-medium">
            Moving code cleanly across segmented route paths preserves application stability and allows enterprise scaling.
          </div>

        </section>

        {/* Dynamic Page Routing */}
        <section className="lg:col-span-3 w-full">

          <Routes>

            {/* Pet Matcher Page */}
            <Route
              path="/"
              element={
                <MatcherPage
                  profile={profile}
                  setProfile={setProfile}
                  handleQuizSubmit={handleQuizSubmit}
                  isMatchLoading={isMatchLoading}
                  matchResult={matchResult}
                  navigateToPlanner={() => navigate('/planner')}
                />
              }
            />

            {/* Live Coach Page */}
            <Route
              path="/coach"
              element={
                <CoachPage
                  messages={messages}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  handleSendMessage={handleSendMessage}
                  isChatLoading={isChatLoading}
                />
              }
            />

            {/* Seven-Day Planner Page */}
            <Route
              path="/planner"
              element={
                <PlannerPage
                  generateSevenDayPlan={generateSevenDayPlan}
                  isPlannerLoading={isPlannerLoading}
                  plannerResult={plannerResult}
                />
              }
            />

            {/* Adoption Gallery */}
            <Route
              path="/adoption"
              element={<AdoptionPage />}
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={
                authUser?.role === 'admin'
                  ? <AdminDashboard />
                  : <Navigate to="/login" replace />
              }
            />

            {/* Login and Register */}
            <Route
              path="/login"
              element={<AuthPage />}
            />

            {/* My Listings */}
            <Route
              path="/my-listings"
              element={
                authUser &&
                ['owner', 'rescuer', 'shelter'].includes(authUser.role)
                  ? <MyListings />
                  : <Navigate to="/login" replace />
              }
            />

            {/* Add Pet Listing */}
            <Route
              path="/add-pet"
              element={
                authUser &&
                ['owner', 'rescuer', 'shelter'].includes(authUser.role)
                  ? <AddPetListing />
                  : <Navigate to="/login" replace />
              }
            />

          </Routes>

        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 font-medium">
        © 2026 PawsomeAdapt Router Platform • Building Sustainable Urban Communities.
      </footer>

    </div>
  );
}

// Main Application
function App() {
  return (
    <BrowserRouter>
      <NavigationWrapper />
    </BrowserRouter>
  );
}

export default App;
