export const buildUserPrompt = (userMessage, fileInfo, currentStep) => {
  let context = `Current pipeline step: ${currentStep}\n`;
  if (fileInfo) {
    context += `Uploaded file: ${fileInfo.name} (${fileInfo.type})\n`;
  }
  return `${context}\nUser: ${userMessage}`;
};