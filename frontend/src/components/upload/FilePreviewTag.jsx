import { X, FileText, Image } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FilePreviewTag({ file, onRemove }) {
  const isImage = file.type?.startsWith('image/');
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full pl-2 pr-1 py-1 text-xs text-slate-300 backdrop-blur-md"
    >
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        isImage ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
      }`}>
        {isImage ? <Image size={12} /> : <FileText size={12} />}
      </div>
      <span className="max-w-[120px] truncate font-medium">{file.name}</span>
      <button 
        onClick={onRemove} 
        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 hover:text-red-400 transition-colors"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
}