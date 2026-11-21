import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5179/api',
  headers: { 'Content-Type': 'application/json' },
});

// Tự động gắn JWT token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tự động logout nếu token hết hạn
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aq_token');
      localStorage.removeItem('aq_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;