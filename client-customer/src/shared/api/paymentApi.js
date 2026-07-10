import axios from 'axios';

const paymentAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' }
});

paymentAxios.interceptors.request.use((config) => {
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
  return config;
});

export const createCheckoutSessionRequest = async (orderId) => {
  return await paymentAxios.post('/payments/checkout-session', { orderId });
};

export const getPaymentSessionRequest = async (sessionId) => {
  return await paymentAxios.get(`/payments/session/${sessionId}`);
};

export const getOrderByIdRequest = async (orderId) => {
  return await paymentAxios.get(`/orders/detalle/${orderId}`);
};
