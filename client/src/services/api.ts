import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
