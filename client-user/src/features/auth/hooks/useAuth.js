// src/features/auth/hooks/useAuth.js

import { useState, useCallback } from 'react';
import { authClient } from '../../../shared/api/authClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogin = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.post('/auth/login', {
        emailOrUsername: data.emailOrUsername,
        password: data.password,
      });

      const { success, message, token, userDetails, refreshToken } = response.data;

      if (success && token) {
        await loginStore(token, userDetails, refreshToken || null);
        return { success: true, message };
      } else {
        const errMsg = message || 'Error al iniciar sesión';
        setError(errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        'Error de conexión';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, [loginStore]);

  const handleRegister = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('Name', data.name);
      formData.append('Surname', data.surname || '');
      formData.append('Username', data.username);
      formData.append('Email', data.email);
      formData.append('Password', data.password);
      formData.append('Phone', data.phone || '');

      const response = await authClient.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { success, message } = response.data;
      if (success) {
        return { success: true, message: message || 'Registro exitoso. Revisa tu correo.' };
      } else {
        const errMsg = message || 'Error al registrarse';
        setError(errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        'Error de conexión';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVerifyEmail = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.post('/auth/verify-email', { token });
      const { success, message } = response.data;
      return { success, message };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error al verificar token';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    handleLogin,
    handleRegister,
    handleVerifyEmail,
    loading,
    error,
    logout: logoutStore,
  };
}
