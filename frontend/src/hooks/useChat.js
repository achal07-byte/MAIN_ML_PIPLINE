import { useState, useEffect } from 'react';
import axios from 'axios';
import { usePipelineStore } from '../store/pipelineStore';

const API_BASE = '/api';

export function useChat() {
  const { sessionId, fileInfo, currentStep, setCurrentStep, updateStep } = usePipelineStore();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setMessages([{ role: 'assistant', content: 'Hi! Upload a CSV or image, and I’ll guide you through building an ML model.' }]);
      return;
    }
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/chat/history/${sessionId}`);
        if (res.data.length > 0) {
          setMessages(res.data);
        } else {
          setMessages([{ role: 'assistant', content: 'Session loaded. How can I help you with this dataset?' }]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [sessionId]);

  const sendMessage = async (userMessage) => {
    if (!sessionId) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Please upload a file first.' }]);
      return;
    }

    const newUserMsg = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/chat/`, {
        message: userMessage,
        session_id: sessionId,
        session_file_path: fileInfo?.path,
        pipeline_step: currentStep,
        history: messages.concat(newUserMsg).slice(-10) // keep last 10 for context
      });
      const aiMessage = res.data.reply;
      const aiImages = res.data.images || [];
      const newStep = res.data.updated_pipeline_step;
      if (newStep && newStep !== currentStep) {
        updateStep(newStep);
        setCurrentStep(newStep);
      }
      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage, images: aiImages }]);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.detail || 'Error connecting to AI. Is the backend running?';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}