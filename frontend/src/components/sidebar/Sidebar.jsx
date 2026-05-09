import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePipelineStore } from '../../store/pipelineStore';
import clsx from 'clsx';
import axios from 'axios';

export default function Sidebar() {
  const { sessionId, reset, setSession } = usePipelineStore();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get('/api/pipeline/sessions');
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSessions();
  }, [sessionId]);

  const loadSession = (s) => {
    setSession(s.id, { name: s.name, path: s.path, type: 'csv' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-8 pb-4">
        <h1 className="text-xl font-bold tracking-tight">AutoML AI</h1>
        <p className="text-sm text-[#666666]">Pipeline Generator</p>
      </div>

      {/* Divider */}
      <div className="mx-8 h-[1px] bg-[#e5e5e3]" />

      {/* New Pipeline Button */}
      <div className="p-8 py-6">
        <button 
          onClick={() => {
            console.log("CRITICAL RESET TRIGGERED");
            reset();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 border border-[#d1d1cf] rounded-xl hover:bg-[#ededeb] active:scale-95 transition-all font-semibold text-[#1a1a1a] cursor-pointer"
          style={{ position: 'relative', zIndex: 9999, pointerEvents: 'auto' }}
        >
          <Plus size={20} className="text-[#1a1a1a]" />
          <span>New pipeline chat</span>
        </button>
      </div>

      {/* Recent Sessions */}
      <div className="flex-1 overflow-y-auto px-4">
        <h2 className="px-4 text-[10px] font-bold uppercase tracking-widest text-[#666666] mb-4">Recent Sessions</h2>
        <div className="space-y-1">
          {sessions.map((s) => (
            <div 
              key={s.id} 
              onClick={() => loadSession(s)}
              className={clsx(
                "px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer select-none",
                s.id === sessionId ? "bg-white shadow-sm font-semibold text-[#1a1a1a]" : "text-[#666666] hover:bg-[#ededeb] hover:text-[#1a1a1a]"
              )}
            >
              {s.name}
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="px-4 text-xs text-[#999999] italic">No past sessions found</p>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="p-8 border-t border-[#e5e5e3]">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#666666] mb-4">Settings</h2>
        <div className="px-4 py-3 bg-white border border-[#e5e5e3] rounded-xl flex items-center gap-2 text-sm shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
          <span>claude-sonnet-4</span>
        </div>
      </div>
    </div>
  );
}