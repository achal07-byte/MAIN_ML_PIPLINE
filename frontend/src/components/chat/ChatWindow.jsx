import { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useChat } from '../../hooks/useChat';
import { usePipeline } from '../../hooks/usePipeline';
import { Send, Table, Image as ImageIcon, FileText, X, Terminal, Sparkles, Wand2 } from 'lucide-react';
import { usePipelineStore } from '../../store/pipelineStore';
import Modal from '../shared/Modal';
import CodeBlock from '../shared/CodeBlock';
import SuggestionChips from './SuggestionChips';

export default function ChatWindow() {
  const { messages, sendMessage, isLoading } = useChat();
  const { exportCode, status } = usePipeline();
  const { fileInfo } = usePipelineStore();
  const [input, setInput] = useState('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const endRef = useRef();

  const profileReportUrl = status?.data_info?.profile_report_path 
    ? `/${status.data_info.profile_report_path}` 
    : null;

  const handleExport = async () => {
    try {
      const code = await exportCode();
      const blob = new Blob([code], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pipeline.py';
      a.click();
    } catch (err) {
      alert("Export failed. Please ensure the model is trained.");
    }
  };

  const handleViewCode = async () => {
    try {
      const code = await exportCode();
      setGeneratedCode(code);
      setIsCodeModalOpen(true);
    } catch (err) {
      alert("Could not generate code yet. Please upload a file first.");
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden" id="chat-workspace">
      {/* Header */}
      <header className="px-8 py-5 border-b border-[#e5e5e3] flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#f5f5f3] border border-[#e5e5e3] rounded-xl flex items-center justify-center text-[#1a1a1a]">
            <Sparkles size={20} />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold tracking-tight text-[#1a1a1a]">
              {fileInfo?.name ? `${fileInfo.name.split('.')[0]} Pipeline` : 'AutoML Session'}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-[#666666]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="uppercase tracking-widest font-bold">AI Agent Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {profileReportUrl && (
            <a 
              href={profileReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[#d1d1cf] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#f9f9f9] transition-all flex items-center gap-2"
            >
              <FileText size={14} />
              View Report
            </a>
          )}
          <button 
            onClick={handleExport}
            className="px-4 py-2 border border-[#d1d1cf] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#f9f9f9] transition-all"
          >
            Export
          </button>
          <button 
            onClick={handleViewCode}
            className="px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-all shadow-sm"
          >
            View Code
          </button>
        </div>
      </header>


      {/* Code Preview Modal */}
      <Modal 
        isOpen={isCodeModalOpen} 
        onClose={() => setIsCodeModalOpen(false)} 
        title="Generated ML Pipeline"
      >
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">
            This Python script contains the full preprocessing and model training pipeline based on your dataset analysis.
          </p>
          <CodeBlock code={generatedCode} />
        </div>
      </Modal>


      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 scroll-smooth">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
            <div className="w-20 h-20 bg-[#fcfcfb] border border-[#e5e5e3] rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <Wand2 size={40} className="text-[#1a1a1a]" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight">How can I build your model?</h1>
              <p className="text-[#666666] text-sm max-w-sm mx-auto">
                I've loaded your data. We can start with exploratory analysis or jump straight to preprocessing.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {['Analyze my dataset', 'Suggest features', 'Clean missing values', 'Train best model'].map(opt => (
                <button 
                  key={opt}
                  onClick={() => sendMessage(opt)}
                  className="px-4 py-3 border border-[#e5e5e3] rounded-2xl text-xs font-semibold hover:border-[#1a1a1a] hover:bg-[#fcfcfb] transition-all text-left flex items-center justify-between group"
                >
                  {opt}
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble key={idx} role={msg.role} content={msg.content} images={msg.images} />
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-4 animate-pulse px-2">
            <div className="w-10 h-10 rounded-xl bg-[#f0f0ee]" />
            <div className="space-y-2">
              <div className="bg-[#f0f0ee] h-4 w-32 rounded-full" />
              <div className="bg-[#f0f0ee] h-4 w-48 rounded-full" />
            </div>
          </div>
        )}
        <div ref={endRef} className="h-10" />
      </div>


      {/* Input Area */}
      <footer className="p-8 bg-white border-t border-[#e5e5e3]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center">
            <SuggestionChips onSelect={(text) => sendMessage(text)} />
          </div>
          
          <div className="flex items-end gap-3 bg-[#fcfcfb] border border-[#d1d1cf] rounded-2xl p-2.5 focus-within:border-[#1a1a1a] focus-within:ring-4 focus-within:ring-[#1a1a1a]/5 transition-all shadow-sm">
            <textarea
              rows="1"
              className="flex-1 bg-transparent border-none px-3 py-2 text-sm focus:outline-none resize-none placeholder:text-[#999999] min-h-[44px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe your ML goal or ask for a suggestion..."
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 bg-[#1a1a1a] text-white rounded-xl flex items-center justify-center hover:bg-black disabled:opacity-20 disabled:grayscale transition-all shadow-md"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ArrowRight({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  );
}