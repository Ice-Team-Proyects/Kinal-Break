import axios from 'axios';

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || 'http://localhost:5296/api/v1',
  timeout: 30000,
});

authAxios.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('ice-auth');
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
    }
  } catch (error) {
    console.warn(error);
  }

  // Avoid forcing Content-Type on GETs (unnecessary CORS preflight noise).
  const method = (config.method || 'get').toLowerCase();
  if (method !== 'get' && method !== 'head' && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
  }

  return config;
});

export const getAuthErrorMessage = (error, fallback = 'Error de conexión con autenticación') => {
  const data = error.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.message) return data.message;
  if (error.response?.status === 401) return 'No autorizado. Vuelve a iniciar sesión.';
  if (error.response?.status === 403) return 'No tienes permisos de administrador.';
  if (error.code === 'ECONNABORTED') return 'Tiempo de espera agotado. Intenta de nuevo.';
  if (error.message === 'Network Error') return 'No se pudo conectar al servicio de autenticación.';
  return error.message || fallback;
};

export const loginRequest = async ({ emailOrUsername, password }) => {
  return await authAxios.post('/auth/login', {
    emailOrUsername,
    password,
  });
};

export const getUsersRequest = async () => {
  return await authAxios.get('/users');
};

export const activateUserRequest = async (userId) => {
  return await authAxios.post(`/users/${userId}/activate`);
};

export const registerRequest = async (formData) => {
  return await authAxios.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const verifyEmailRequest = async (token) => {
  return await authAxios.post('/auth/verify-email', { token });
};

export const resendVerificationRequest = async (email) => {
  return await authAxios.post('/auth/resend-verification', { email });
};

export const forgotPasswordRequest = async (email) => {
  return await authAxios.post('/auth/forgot-password', { email });
};

export const resetPasswordRequest = async (token, newPassword) => {
  return await authAxios.post('/auth/reset-password', { token, newPassword });
};