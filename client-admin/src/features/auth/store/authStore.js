import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginRequest, registerRequest, verifyEmailRequest, resendVerificationRequest, forgotPasswordRequest, resetPasswordRequest } from '../../../shared/api/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoadingAuth: false,
      emailVerificationRequired: false,
      pendingVerificationEmail: null,

      // Called on app boot to hydrate auth state from localStorage
      checkAuth: () => {
        const token = get().token;
        set({ isLoadingAuth: false, isAuthenticated: Boolean(token) });
      },

      // Real login with backend API
      login: async ({ email, password }) => {
        if (!email || !password) {
          return { success: false, error: 'Correo y contraseña son requeridos.' };
        }

        try {
          const response = await loginRequest({ emailOrUsername: email, password });
          const { success, message, token, userDetails } = response.data;

          if (success && token) {
            set({
              user: {
                id: userDetails?.id,
                username: userDetails?.username,
                name: userDetails?.name,
                role: userDetails?.role,
                email: email,
              },
              token: token,
              isAuthenticated: true,
              emailVerificationRequired: false,
              pendingVerificationEmail: null,
            });
            return { success: true, message };
          } else {
            return { success: false, error: message || 'Error al iniciar sesión' };
          }
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message || 'Error de conexión';
          return { success: false, error: errorMsg };
        }
      },

      // Real register with backend API
      register: async ({ name, surname, username, email, password, phone }) => {
        try {
          const formData = new FormData();
          formData.append('Name', name);
          formData.append('Surname', surname || '');
          formData.append('Username', username);
          formData.append('Email', email);
          formData.append('Password', password);
          formData.append('Phone', phone || '');

          const response = await registerRequest(formData);
          const { success, message } = response.data;

          if (success) {
            set({
              emailVerificationRequired: true,
              pendingVerificationEmail: email,
            });
            return { 
              success: true, 
              message: message || 'Usuario registrado. Por favor verifica tu email.',
              requiresVerification: true,
              email,
            };
          } else {
            return { success: false, error: message || 'Error al registrarse' };
          }
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message || 'Error de conexión';
          return { success: false, error: errorMsg };
        }
      },

      // Verify email with token
      verifyEmail: async (token) => {
        try {
          const response = await verifyEmailRequest(token);
          const { success, message } = response.data;

          if (success) {
            set({
              emailVerificationRequired: false,
              pendingVerificationEmail: null,
            });
            return { success: true, message: message || 'Email verificado exitosamente' };
          } else {
            return { success: false, error: message || 'Token inválido o expirado' };
          }
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message || 'Error de conexión';
          return { success: false, error: errorMsg };
        }
      },

      // Resend verification email
      resendVerification: async (email) => {
        try {
          const response = await resendVerificationRequest(email);
          const { success, message } = response.data;

          if (success) {
            return { success: true, message: message || 'Email de verificación enviado' };
          } else {
            return { success: false, error: message || 'No se pudo enviar el email' };
          }
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message || 'Error de conexión';
          return { success: false, error: errorMsg };
        }
      },

      logout: () =>
        set({
          
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          emailVerificationRequired: false,
          pendingVerificationEmail: null,
        }),

      // Used internally by axios interceptor to refresh tokens
      setTokens: ({ token, refreshToken }) =>
        set({ token, refreshToken, isAuthenticated: true }),

      forgotPassword: async (email) => {
        try {
          const response = await forgotPasswordRequest(email);
          return { success: response.data?.success, message: response.data?.message };
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message || 'Error de conexión';
          return { success: false, error: errorMsg };
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          const response = await resetPasswordRequest(token, newPassword);
          return { success: response.data?.success, message: response.data?.message };
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message || 'Error de conexión';
          return { success: false, error: errorMsg };
        }
      },
    }),
    { name: 'ice-auth' }
  )
);