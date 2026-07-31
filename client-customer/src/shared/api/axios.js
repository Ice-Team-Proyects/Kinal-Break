import axios from 'axios';

const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

adminAxios.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('ice-auth-customer');
    if (stored) {
      const parsedData = JSON.parse(stored);
      const token = parsedData?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.warn(error);
  }
  return config;
});

const pedidosAxios = axios.create({
  baseURL: import.meta.env.VITE_PEDIDOS_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

pedidosAxios.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('ice-auth-customer');
    if (stored) {
      const parsedData = JSON.parse(stored);
      const token = parsedData?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['x-token'] = token;
      }
    }
  } catch (error) {
    console.warn(error);
  }
  // Let the browser set multipart boundary for FormData uploads
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (config.headers && typeof config.headers.delete === 'function') {
      config.headers.delete('Content-Type');
    } else if (config.headers) {
      delete config.headers['Content-Type'];
    }
  }
  return config;
});

export { adminAxios, pedidosAxios };
