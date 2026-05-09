import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from './components/chat/ChatWindow';
import PipelineSteps from './components/pipeline/PipelineSteps';
import Sidebar from './components/sidebar/Sidebar';
import FileUploader from './components/upload/FileUploader';
import { usePipelineStore } from './store/pipelineStore';
import { usePipeline } from './hooks/usePipeline';
import { Database } from 'lucide-react';

function App() {
  const { sessionId, setSession, setCurrentStep } = usePipelineStore();
  const { status } = usePipeline();

  const handleUploadComplete = (data) => {
    setSession(data.session_id, { path: data.file_path, name: data.filename, type: data.file_type });
    setCurrentStep('eda');
  };

  return (
    <div className="flex h-screen bg-[#fcfcfb] text-[#1a1a1a] overflow-hidden">
      {/* Column 1: Navigation */}
      <div className="w-[280px] bg-[#f5f5f3] border-r border-[#e5e5e3] flex flex-col shrink-0 relative z-50">
        <Sidebar />
      </div>

      {/* Column 2: Pipeline Steps */}
      <div className="w-[320px] bg-[#f0f0ee] border-r border-[#e5e5e3] flex flex-col shrink-0">
        <PipelineSteps />
      </div>

      {/* Column 3: Workspace */}
      <div className="flex-1 flex flex-col min-w-[500px] bg-white border-l border-[#e5e5e3]">
        {!sessionId ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="max-w-md w-full text-center space-y-8">
              <div className="w-16 h-16 bg-[#f5f5f3] border border-[#e5e5e3] rounded-2xl flex items-center justify-center mx-auto text-[#666666]">
                <Database size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Initiate Pipeline</h2>
                <p className="text-[#666666] text-sm">Upload your dataset to begin the automated ML lifecycle.</p>
              </div>
              <FileUploader onUploadComplete={handleUploadComplete} />
            </div>
          </div>
        ) : (
          <ChatWindow />
        )}
      </div>
    </div>
  );
}

export default App;