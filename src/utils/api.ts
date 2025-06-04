// utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Your FastAPI base URL
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' && localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
