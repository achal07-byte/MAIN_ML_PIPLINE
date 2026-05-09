const STORAGE_KEY = 'automl_sessions';

export const storage = {
  getSessions: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveSession: (session) => {
    const sessions = storage.getSessions();
    if (!sessions.find(s => s.id === session.id)) {
      const updated = [session, ...sessions.slice(0, 9)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  },
  clearSessions: () => localStorage.removeItem(STORAGE_KEY)
};