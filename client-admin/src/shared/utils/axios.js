import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('ice-auth');
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
    }
  } catch (error) {
    console.warn(error);
  }
  return config;
});

export default axiosInstance;