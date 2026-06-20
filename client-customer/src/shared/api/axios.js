import axios from 'axios';

const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

adminAxios.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('ice-auth');
    if (stored) {
      const parsedData = JSON.parse(stored);
      const token = parsedData?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (_) {}
  return config;
});

const pedidosAxios = axios.create({
  baseURL: import.meta.env.VITE_PEDIDOS_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

pedidosAxios.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('ice-auth');
    if (stored) {
      const parsedData = JSON.parse(stored);
      const token = parsedData?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['x-token'] = token;
      }
    }
  } catch (_) {}
  return config;
});

export { adminAxios, pedidosAxios };
