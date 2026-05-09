import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Upload, CheckCircle2, AlertCircle, Loader2, Database } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function FileUploader({ onUploadComplete }) {
  const [status, setStatus] = useState('idle');
  const [fileName, setFileName] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    multiple: false,
    onDrop: async (files) => {
      const file = files[0];
      setFileName(file.name);
      setStatus('uploading');
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await axios.post('/api/upload/', formData);
        setStatus('success');
        // Immediate hand-off for a "snappy" feel
        onUploadComplete(res.data, file);
      } catch (err) {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300",
        isDragActive 
          ? "border-[#1a1a1a] bg-[#f5f5f3]" 
          : "border-[#e5e5e3] hover:border-[#d1d1cf] hover:bg-[#fcfcfb] bg-white shadow-sm"
      )}
    >
      <input {...getInputProps()} />
      
      {status === 'idle' && (
        <div className="space-y-5">
          <div className="w-16 h-16 bg-[#f5f5f3] border border-[#e5e5e3] rounded-2xl flex items-center justify-center mx-auto text-[#1a1a1a]">
            <Upload size={28} />
          </div>
          <div className="space-y-2">
            <p className="text-base font-bold text-[#1a1a1a]">Upload Training Signal</p>
            <p className="text-sm text-[#666666]">Drag & drop your CSV or Image to begin analysis</p>
          </div>
          <div className="pt-2">
            <span className="px-4 py-2 bg-[#f0f0ee] text-[#666666] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#e5e5e3]">
              CSV · JPG · PNG
            </span>
          </div>
        </div>
      )}

      {status === 'uploading' && (
        <div className="space-y-6 py-4">
          <Loader2 size={32} className="mx-auto animate-spin text-[#1a1a1a]" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#1a1a1a]">Ingesting Signal</p>
            <p className="text-xs text-[#666666]">{fileName}</p>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6 py-4 text-[#22c55e]">
          <div className="w-16 h-16 bg-[#22c55e]/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest">Signal Verified</p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6 py-4 text-rose-500">
          <AlertCircle size={32} className="mx-auto" />
          <p className="text-sm font-bold uppercase tracking-widest">Signal Rejection</p>
          <p className="text-xs text-[#666666]">Please check file format and try again</p>
        </div>
      )}
    </div>
  );
}