import axios from 'axios';

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || 'http://localhost:5296/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
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
  return config;
});

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