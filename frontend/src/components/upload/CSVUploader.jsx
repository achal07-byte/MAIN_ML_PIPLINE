import { useDropzone } from 'react-dropzone';
import { FileText, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CSVUploader({ onUpload }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    onDrop: (files) => onUpload(files[0])
  });

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
        isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
      }`}
    >
      <input {...getInputProps()} />
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-3">
        <FileText className="text-blue-400" size={24} />
      </div>
      <p className="text-sm font-medium text-slate-300">Upload CSV</p>
      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Drag & Drop</p>
    </motion.div>
  );
}