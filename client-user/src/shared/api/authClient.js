// src/shared/api/authClient.js

import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints.js';
import { useAuthStore } from '../store/authStore.js';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const authClient = axios.create({
  baseURL: ENDPOINTS.AUTH,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

authClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const NO_REFRESH_URLS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/resend-verification',
];

authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isNoRefreshUrl = NO_REFRESH_URLS.some((url) =>
      originalRequest?.url?.includes(url)
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isNoRefreshUrl) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return authClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await useAuthStore.getState().getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${ENDPOINTS.AUTH}/auth/refresh`, {
          refreshToken,
        });

        const { token, accessToken } = response.data;
        const newAccessToken = token || accessToken;

        if (newAccessToken) {
          useAuthStore.getState().setAccessToken(newAccessToken);
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return authClient(originalRequest);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
