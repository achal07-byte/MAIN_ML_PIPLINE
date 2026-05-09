import { create } from 'zustand';

export const usePipelineStore = create((set) => ({
  sessionId: null,
  fileInfo: null,
  previewData: [],
  currentStep: 'data_upload',
  pipelineSteps: ['data_upload', 'eda', 'preprocessing', 'model_selection', 'training', 'evaluation', 'export_code'],
  
  setSession: (id, info) => set({ sessionId: id, fileInfo: info }),
  setPreviewData: (data) => set({ previewData: data }),
  setCurrentStep: (step) => set({ currentStep: step }),
  
  updateStep: (step) => set((state) => {
    const currentIndex = state.pipelineSteps.indexOf(state.currentStep);
    const newIndex = state.pipelineSteps.indexOf(step);
    if (newIndex > currentIndex) return { currentStep: step };
    return {};
  }),

  reset: () => set({ sessionId: null, fileInfo: null, previewData: [], currentStep: 'data_upload' })
}));