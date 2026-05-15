import { API_URL, handleResponse } from './config.js';

// API endpoints for public feedback and contact forms
export const feedbackApi = {
  send: async (formData) => {
    const res = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return handleResponse(res);
  },
};
