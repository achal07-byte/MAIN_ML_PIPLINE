import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-all backdrop-blur-md"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-l-lg" />
      <pre className="bg-gray-950/50 border border-white/5 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed text-blue-100 scrollbar-hide">
        <code>{code}</code>
      </pre>
    </div>
  );
}