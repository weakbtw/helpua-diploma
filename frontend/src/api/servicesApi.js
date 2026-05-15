import { API_URL, handleResponse } from './config.js';

// API endpoints for fetching social services catalog
export const servicesApi = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/services`);
    return handleResponse(res);
  },
};
