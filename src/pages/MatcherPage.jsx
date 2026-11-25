import React from 'react';

export default function MatcherPage({ profile, setProfile, handleQuizSubmit, isMatchLoading, matchResult, navigateToPlanner }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 grid md:grid-cols-5 gap-6">
      <form onSubmit={handleQuizSubmit} className="md:col-span-2 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Lifestyle Assessment</h2>
          <p className="text-xs text-slate-400 mt-0.5">Map parameters onto local environments.</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Housing Type</label>
            <select value={profile.housing} onChange={(e) => setProfile({...profile, housing: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400">
              <option>Apartment</option><option>Townhouse</option><option>Suburban House (Fenced)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Work Schedule</label>
            <select value={profile.workHours} onChange={(e) => setProfile({...profile, workHours: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400">
              <option>Remote (0-2 hours away)</option><option>Part Time (3-5 hours away)</option><option>Full Time Office (6-9 hours away)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Daily Activity Output</label>
            <select value={profile.activityLevel} onChange={(e) => setProfile({...profile, activityLevel: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400">
              <option>Low energy / Cuddling</option><option>Moderate walks</option><option>High intensity runs/hikes</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Has Young Children</label>
            <select value={profile.hasChildren} onChange={(e) => setProfile({...profile, hasChildren: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400">
              <option>No</option><option>Yes (Under 10 years old)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Ownership Experience</label>
            <select value={profile.experience} onChange={(e) => setProfile({...profile, experience: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400">
              <option>Beginner (First-time owner)</option><option>Intermediate (Had a family pet)</option><option>Expert (Experienced trainer)</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={isMatchLoading} className="w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-xl hover:bg-slate-800 transition shadow-xs disabled:opacity-50">
          {isMatchLoading ? "Processing Match Analytics..." : "Generate AI Matching Analysis"}
        </button>
      </form>
      <div className="md:col-span-3 bg-slate-50 rounded-xl border border-slate-200/80 p-5 flex flex-col justify-between min-h-[400px]">
        <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700 font-medium">
          {matchResult ? matchResult : (
            <div className="text-center py-20 text-slate-400">
              <span className="text-3xl block mb-2">📊</span> Fill out the lifestyle parameters questionnaire to trigger your analysis.
            </div>
          )}
        </div>
        {matchResult && !isMatchLoading && (
          <button onClick={navigateToPlanner} className="mt-4 self-end bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-emerald-700 transition">
            Proceed to 7-Day Custom Transition Planner ➔
          </button>
        )}
      </div>
    </div>
  );
}
