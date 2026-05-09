import { useState, useEffect } from 'react';
import axios from 'axios';
import { usePipelineStore } from '../store/pipelineStore';

export function usePipeline() {
  const { sessionId, currentStep, setCurrentStep } = usePipelineStore();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`/api/pipeline/status/${sessionId}`);
        setStatus(res.data);
        if (res.data.step !== currentStep) setCurrentStep(res.data.step);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [sessionId, currentStep, setCurrentStep]);

  const runPreprocessing = async (strategy = 'auto') => {
    await axios.post(`/api/pipeline/preprocess/${sessionId}`, null, { params: { strategy } });
  };

  const trainModel = async (targetColumn, problemType) => {
    const res = await axios.post(`/api/pipeline/train/${sessionId}`, null, {
      params: { target_column: targetColumn, problem_type: problemType }
    });
    return res.data.metrics;
  };

  const exportCode = async () => {
    const res = await axios.get(`/api/pipeline/export/${sessionId}`);
    return res.data.code;
  };

  return { status, runPreprocessing, trainModel, exportCode };
}