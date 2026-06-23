import adminAxios from './axios';
import axios from 'axios';

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || 'http://localhost:5296/api/v1',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

export const loginRequest = async ({ emailOrUsername, password }) => {
  return await authAxios.post('/auth/login', {
    emailOrUsername,
    password,
  });
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