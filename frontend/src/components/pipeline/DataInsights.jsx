import { BarChart3, Database, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

export default function DataInsights({ dataInfo }) {
  if (!dataInfo) return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-700 space-y-4">
      <Database size={32} strokeWidth={1.5} />
      <p className="text-[11px] font-bold uppercase tracking-widest">Awaiting Data Signal</p>
    </div>
  );

  const stats = [
    { label: 'Samples', value: dataInfo?.rows ?? 0, icon: <Database size={14} /> },
    { label: 'Features', value: dataInfo?.cols ?? 0, icon: <BarChart3 size={14} /> },
    { label: 'Missing', value: dataInfo?.missing_count ?? 0, icon: <AlertCircle size={14} />, color: (dataInfo?.missing_count ?? 0) > 0 ? 'text-amber-500' : 'text-emerald-500' },
  ];

  return (
    <div className="p-6 space-y-10 bg-[#09090b] h-full border-l border-white/[0.06]">
      <div className="space-y-1">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Analytics</h2>
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          Dataset Signals <CheckCircle2 className="text-emerald-500" size={14} />
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500">
              {stat.icon}
              <span className="text-[11px] font-medium">{stat.label}</span>
            </div>
            <div className={clsx("text-xs font-bold", stat.color || "text-white")}>
              {stat.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Model Configuration</h4>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">Target Feature</span>
            <span className="text-[11px] font-bold text-white px-2 py-0.5 bg-blue-600/10 border border-blue-500/20 rounded">
              {dataInfo?.target_candidate ?? 'Detecting...'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">Problem Type</span>
            <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-tighter">
              {dataInfo?.problem_type ?? 'Analyzing...'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Feature Density</h4>
        <div className="space-y-4">
          {dataInfo?.numeric_features?.slice(0, 4).map((feat) => (
            <div key={feat} className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
                <span>{feat}</span>
                <span className="text-zinc-600">Active</span>
              </div>
              <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-700"
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
