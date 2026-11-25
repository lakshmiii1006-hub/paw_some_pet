import React from 'react';

export default function PlannerPage({ generateSevenDayPlan, isPlannerLoading, plannerResult }) {
  
  // Custom Local File Export Trigger Engine
  const exportRoutineAsFile = () => {
    if (!plannerResult) return;
    
    // Create a plain text blob container with structural layout strings
    const fileHeading = "========================================================\n" +
                        "  PAWSOMEADAPT: 7-DAY PET ADAPTATION & TRAINING BLUEPRINT\n" +
                        "  Aligned with UN SDG 11: Sustainable Human Settlements\n" +
                        "========================================================\n\n";
                        
    const completeFileContent = fileHeading + plannerResult;
    const blob = new Blob([completeFileContent], { type: 'text/plain;charset=utf-8' });
    
    // Create an invisible anchor link element to programmatically trigger the download
    const anchorLink = document.createElement('a');
    anchorLink.href = URL.createObjectURL(blob);
    anchorLink.download = 'pawsomeadapt-7day-routine-plan.txt';
    
    // Inject node, trigger browser save pipeline, and clean memory cache references
    document.body.appendChild(anchorLink);
    anchorLink.click();
    document.body.removeChild(anchorLink);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">7-Day Settlement Routine Schedule Generator</h2>
          <p className="text-xs text-slate-400 mt-0.5">Automate structure integration blueprints for domestic rescue animals.</p>
        </div>
        
        {/* Action Button Segment Panel */}
        <div className="flex items-center gap-2">
          {plannerResult && !isPlannerLoading && (
            <button 
              onClick={exportRoutineAsFile}
              className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              📥 Save Blueprint
            </button>
          )}
          <button 
            onClick={generateSevenDayPlan} 
            disabled={isPlannerLoading} 
            className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {isPlannerLoading ? "Compiling Blueprint..." : "🚀 Build Decompression Routine"}
          </button>
        </div>
      </div>
      
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 min-h-[460px] whitespace-pre-line text-xs text-slate-700 leading-relaxed font-medium">
        {plannerResult ? plannerResult : (
          <div className="text-center py-24 text-slate-400">
            <span className="text-3xl block mb-2">📅</span> Click the blueprint compile button to assemble your 7-day timeline matrix.
          </div>
        )}
      </div>
    </div>
  );
}
