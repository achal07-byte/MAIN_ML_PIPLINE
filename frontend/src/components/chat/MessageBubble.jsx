import clsx from 'clsx';
import { User, Bot, Sparkles, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function MessageBubble({ role, content, images }) {
  const isUser = role === 'user';
  const [expandedImg, setExpandedImg] = useState(null);
  
  // Safety check for content
  const textContent = typeof content === 'string' ? content : JSON.stringify(content);
  
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={clsx("flex gap-4", isUser ? "flex-row-reverse" : "flex-row")}
      >
        <div className={clsx(
          "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105",
          isUser 
            ? "bg-white border-[#d1d1cf] text-[#666666]" 
            : "bg-[#1a1a1a] border-[#1a1a1a] text-white"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        <div className={clsx("max-w-[80%] space-y-1.5", isUser ? "text-right" : "text-left")}>
          <div className="flex items-center gap-2 px-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">
              {isUser ? 'Researcher' : 'Pipeline Agent'}
            </span>
            {!isUser && <Sparkles size={10} className="text-[#1a1a1a] opacity-50" />}
          </div>
          
          <div className={clsx(
            "px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all hover:shadow-md",
            isUser 
              ? "bg-white border border-[#e5e5e3] text-[#1a1a1a] rounded-tr-none" 
              : "bg-[#f5f5f3] border border-[#e5e5e3] text-[#1a1a1a] rounded-tl-none"
          )}>
            {textContent.split('\n').map((line, i) => (
              <p key={i} className={clsx(i > 0 && "mt-2")}>{line}</p>
            ))}
          </div>

          {/* Inline Chart Images */}
          {images && images.length > 0 && (
            <div className="flex flex-col gap-3 mt-3">
              {images.map((imgPath, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                  className="relative group cursor-pointer"
                  onClick={() => setExpandedImg(`/${imgPath}`)}
                >
                  <img 
                    src={`/${imgPath}`} 
                    alt={`Chart ${idx + 1}`}
                    className="rounded-2xl border border-[#e5e5e3] shadow-md w-full max-w-lg hover:shadow-xl transition-all"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                      <ZoomIn size={14} className="text-[#1a1a1a]" />
                      <span className="text-[11px] font-bold text-[#1a1a1a]">Expand</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Fullscreen Image Overlay */}
      {expandedImg && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-8 cursor-pointer"
          onClick={() => setExpandedImg(null)}
        >
          <motion.img 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={expandedImg} 
            alt="Expanded chart"
            className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10"
          />
          <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
            Click to close
          </div>
        </motion.div>
      )}
    </>
  );
}