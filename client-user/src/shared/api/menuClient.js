// src/shared/api/menuClient.js

import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints.js';
import { useAuthStore } from '../store/authStore.js';

export const menuClient = axios.create({
  baseURL: ENDPOINTS.API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

menuClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-token'] = token;
  }
  return config;
});

menuClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request in menuClient');
    }
    return Promise.reject(error);
  }
);
