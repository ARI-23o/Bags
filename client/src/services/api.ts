import axios from 'axios';

// Normalize baseURL so it handles both 'https://domain.com' and 'https://domain.com/api'
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for clear error messaging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      'Bir bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol ediniz.';
    return Promise.reject(new Error(message));
  }
);

export default api;
