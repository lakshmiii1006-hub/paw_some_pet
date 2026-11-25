import React from 'react';

export default function CoachPage({ messages, chatInput, setChatInput, handleSendMessage, isChatLoading }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[620px] overflow-hidden">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
        <div>
          <h2 className="text-sm font-bold tracking-wide">Live Behavioral Assistant Engine</h2>
          <p className="text-xs text-slate-400">Real-time optimization scripts supporting domestic settlement adaptation</p>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-xs shadow-xs border leading-relaxed font-medium ${
              msg.sender === 'user' ? 'bg-slate-900 text-white border-slate-800 rounded-br-none' : 'bg-white text-slate-800 border-slate-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isChatLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-400 border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 text-xs shadow-xs animate-pulse font-medium">
              Compiling customized behavior coaching feedback...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex gap-2 items-center">
        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={isChatLoading} placeholder="Query specific behavioral adjustment vulnerabilities..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-slate-400 transition disabled:opacity-50" required />
        <button type="submit" disabled={isChatLoading} className="bg-slate-900 text-white text-xs font-bold px-6 py-3.5 rounded-xl hover:bg-slate-800 transition active:scale-98 shadow-xs disabled:opacity-50">Send</button>
      </form>
    </div>
  );
}
