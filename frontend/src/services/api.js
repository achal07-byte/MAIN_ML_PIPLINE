import axios from 'axios';

const API_BASE = '/api';

export const api = {
  chat: {
    send: (data) => axios.post(`${API_BASE}/chat/`, data)
  },
  upload: {
    file: (formData) => axios.post(`${API_BASE}/upload/`, formData)
  },
  pipeline: {
    getStatus: (sessionId) => axios.get(`${API_BASE}/pipeline/status/${sessionId}`),
    preprocess: (sessionId, strategy) => axios.post(`${API_BASE}/pipeline/preprocess/${sessionId}`, null, { params: { strategy } }),
    train: (sessionId, targetColumn, problemType) => axios.post(`${API_BASE}/pipeline/train/${sessionId}`, null, { params: { target_column: targetColumn, problem_type: problemType } }),
    export: (sessionId) => axios.get(`${API_BASE}/pipeline/export/${sessionId}`)
  }
};