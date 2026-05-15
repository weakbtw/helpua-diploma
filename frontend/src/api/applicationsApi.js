import { API_URL, getAuthHeaders, handleResponse } from './config.js';

// API endpoints for managing social service applications
export const applicationsApi = {
  create: async (formData) => {
    const res = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });
    return handleResponse(res);
  },

  getMy: async () => {
    const res = await fetch(`${API_URL}/applications/my`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/applications/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
