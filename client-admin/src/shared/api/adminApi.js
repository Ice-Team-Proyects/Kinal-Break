import adminAxios from './axios';
import axios from 'axios';

// Axios instance for pedidos-service (port 3010)
const pedidosAxios = axios.create({
  baseURL: import.meta.env.VITE_PEDIDOS_URL || 'http://localhost:3010/api',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});
pedidosAxios.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('ice-auth');
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
    }
  } catch (_) {}
  return config;
});

// --- PRODUCTOS ---
export const getProductsRequest = async ({ category = '', search = '' } = {}) => {
  const params = {};
  if (category) params.category = category;
  if (search) params.search = search;
  return await adminAxios.get('/products', { params });
};

export const createProductRequest = async (formData) => {
  return await adminAxios.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateProductRequest = async (id, formData) => {
  return await adminAxios.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteProductRequest = async (id) => {
  return await adminAxios.patch(`/products/delete/${id}`);
};

export const restoreProductRequest = async (id) => {
  return await adminAxios.patch(`/products/restore/${id}`);
};

// --- ACOMPAÑAMIENTOS ---
export const getAccompanimentsRequest = async () => {
  return await adminAxios.get('/accompaniment');
};

export const createAccompanimentRequest = async (formData) => {
  return await adminAxios.post('/accompaniment', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateAccompanimentRequest = async (id, formData) => {
  return await adminAxios.put(`/accompaniment/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteAccompanimentRequest = async (id) => {
  return await adminAxios.patch(`/accompaniment/delete/${id}`);
};

export const restoreAccompanimentRequest = async (id) => {
  return await adminAxios.patch(`/accompaniment/restore/${id}`);
};

// --- PEDIDOS (ÓRDENES) ---
export const getOrdersRequest = async ({ estado = '', usuarioId = '' } = {}) => {
  const params = {};
  if (estado) params.estado = estado;
  if (usuarioId) params.usuarioId = usuarioId;
  return await adminAxios.get('/orders', { params });
};

export const updateOrderStatusRequest = async (id, { estado, confirmacionDoble = false }) => {
  return await adminAxios.put(`/orders/${id}`, { estado, confirmacionDoble });
};

export const deleteOrderRequest = async (id) => {
  return await adminAxios.delete(`/orders/${id}`);
};

// --- PAGOS ---
export const getPaymentsRequest = async () => {
  return await adminAxios.get('/payments');
};

export const getPaymentByOrderRequest = async (orderId) => {
  return await adminAxios.get(`/payments/order/${orderId}`);
};

export const createPaymentRequest = async (data) => {
  return await adminAxios.post('/payments', data);
};

export const deletePaymentRequest = async (id) => {
  return await adminAxios.delete(`/payments/${id}`);
};

export const setPaymentUnpaidRequest = async (id, { confirm = true }) => {
  return await adminAxios.patch(`/payments/unpaid/${id}`, { confirm });
};

// --- REPORTES ---
export const getSalesReportTotalRequest = async () => {
  return await adminAxios.get('/reports/sales/total');
};

export const getSalesReportDailyRequest = async () => {
  return await adminAxios.get('/reports/sales/daily');
};

export const getSalesReportWeeklyRequest = async () => {
  return await adminAxios.get('/reports/sales/weekly');
};

export const getSalesReportMonthlyRequest = async () => {
  return await adminAxios.get('/reports/sales/monthly');
};

export const getTopProductsReportRequest = async () => {
  return await adminAxios.get('/reports/products/top');
};

export const getAverageOrderReportRequest = async () => {
  return await adminAxios.get('/reports/sales/average');
};

export const getOperationalReportRequest = async () => {
  return await adminAxios.get('/reports/metrics/operations');
};

export const exportExcelReportRequest = async () => {
  return await adminAxios.get('/reports/export/excel', {
    responseType: 'blob'
  });
};

export const exportPDFReportRequest = async () => {
  return await adminAxios.get('/reports/export/pdf', {
    responseType: 'blob'
  });
};

export const getUserProfileByIdRequest = async (userId) => {
  const authUrl = import.meta.env.VITE_AUTH_URL;
  return await axios.post(`${authUrl}/auth/profile/by-id`, { userId });
};

// --- PEDIDOS (pedidos-service, port 3010) ---
export const getCarritoRequest = async () =>
  await pedidosAxios.get('/pedidos/carrito');

export const agregarAlCarritoRequest = async ({ productoId, cantidad, acompanamientoId }) =>
  await pedidosAxios.post('/pedidos/carrito', { productoId, cantidad, acompanamientoId });

export const confirmarPedidoRequest = async () =>
  await pedidosAxios.post('/pedidos/confirmar');

export const getHistorialPedidosRequest = async () =>
  await pedidosAxios.get('/pedidos/historial');
