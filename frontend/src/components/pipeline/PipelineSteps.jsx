import { Check, ArrowRight, Circle } from 'lucide-react';
import { usePipelineStore } from '../../store/pipelineStore';
import clsx from 'clsx';

const STEPS = [
  { id: 'data_upload', label: 'Data Ingestion', description: 'Upload and validate dataset' },
  { id: 'eda', label: 'Exploratory Analysis', description: 'Statistical profiling & drift check' },
  { id: 'preprocessing', label: 'Preprocessing', description: 'Feature scaling & encoding' },
  { id: 'model_selection', label: 'Model Selection', description: 'Auto-tuning algorithms' },
  { id: 'training', label: 'Model Training', description: 'Gradient boosting & neural nets' },
  { id: 'evaluation', label: 'Evaluation', description: 'Precision, Recall & ROC curves' },
  { id: 'export_code', label: 'Deployment', description: 'Export as production API' }
];

export default function PipelineSteps() {
  const { currentStep, pipelineSteps } = usePipelineStore();
  
  // Safe index calculation
  const currentIndex = STEPS.findIndex(s => s.id === (currentStep || 'data_upload'));
  const progress = Math.round(((currentIndex + 1) / STEPS.length) * 100);

  return (
    <div className="flex flex-col h-full bg-[#f0f0ee] p-8 border-l border-[#e5e5e3]">
      <div className="mb-8 space-y-2">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#666666]">Pipeline Progress</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-[#d1d1cf] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1a1a1a] transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="text-xs font-bold text-[#1a1a1a]">{progress}%</span>
        </div>
      </div>

      <div className="flex-1 relative space-y-0">
        {/* Connection Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-[#d1d1cf]" />

        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isActive = idx === currentIndex;
          
          return (
            <div key={step.id} className="relative flex items-start gap-4 pb-8 group">
              <div className={clsx(
                "relative z-10 w-[23px] h-[23px] rounded-full flex items-center justify-center border transition-all",
                isDone ? "bg-[#22c55e] border-[#22c55e] text-white" : 
                isActive ? "bg-[#1a1a1a] border-[#1a1a1a] text-white shadow-lg" : 
                "bg-[#f0f0ee] border-[#d1d1cf] text-[#999999]"
              )}>
                {isDone ? <Check size={12} strokeWidth={3} /> : 
                 isActive ? <ArrowRight size={12} strokeWidth={3} /> : 
                 <Circle size={8} fill="currentColor" />}
              </div>

              <div className={clsx(
                "flex-1 pt-0.5 transition-opacity",
                isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
              )}>
                <h3 className={clsx(
                  "text-xs font-bold uppercase tracking-tight",
                  isActive ? "text-[#1a1a1a]" : "text-[#666666]"
                )}>
                  {step.label}
                </h3>
                <p className="text-[10px] text-[#999999] leading-tight mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}