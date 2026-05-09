const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['text/csv', 'image/png', 'image/jpeg'];

export const validateFile = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not supported. Use CSV, PNG, or JPEG.' };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File too large (max 10MB).' };
  }
  return { valid: true };
};