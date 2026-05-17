// Core API configuration and shared utilities
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Attaches JWT token to request headers if available in local storage
export const getAuthHeaders = () => {
  const token = localStorage.getItem('helpua_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Standardized response handler for all fetch requests
export const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Помилка запиту');
  return data;
};
