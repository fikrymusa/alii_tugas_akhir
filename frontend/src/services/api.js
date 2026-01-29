import axios from 'axios';

// Buat instance axios agar tidak perlu ketik URL berulang-ulang
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Perhatikan ada /api di sini
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Setiap request otomatis membawa Token (jika sudah login)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;