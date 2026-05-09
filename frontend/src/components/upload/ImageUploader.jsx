import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUploader({ onUpload }) {
  const [preview, setPreview] = useState(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
    onDrop: (files) => {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
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
      <div className="relative w-20 h-20 mx-auto mb-3">
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.img 
              key="preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-xl shadow-lg border border-white/10" 
            />
          ) : (
            <motion.div 
              key="icon"
              className="w-full h-full bg-white/5 rounded-xl flex items-center justify-center"
            >
              <ImageIcon className="text-purple-400" size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-sm font-medium text-slate-300">Upload Image</p>
      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Drag & Drop</p>
    </motion.div>
  );
}