import { create } from 'zustand'

const useChatStore = create((set) => ({
  messages: [
    { id: '1', text: "Hello! I'm your AI AutoML assistant. Upload a dataset to get started.", sender: 'ai' }
  ],
  isTyping: false,
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, { ...message, id: Date.now().toString() }] 
  })),
  setTyping: (status) => set({ isTyping: status }),
}))

export default useChatStore
