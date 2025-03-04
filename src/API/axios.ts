import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000/v1', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication (if needed)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;