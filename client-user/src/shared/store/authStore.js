// src/shared/store/authStore.js

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'kb_refresh_token';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      login: async (accessToken, userDetails, refreshToken = null) => {
        if (refreshToken) {
          try {
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
          } catch (e) {
            console.warn('SecureStore setItem error:', e);
          }
        }
        set({
          token: accessToken,
          user: userDetails,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        } catch (e) {
          console.warn('SecureStore deleteItem error:', e);
        }
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setAccessToken: (newToken) => {
        set({ token: newToken, isAuthenticated: Boolean(newToken) });
      },

      updateUser: (updatedFields) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : updatedFields,
        }));
      },

      getRefreshToken: async () => {
        try {
          return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        } catch (e) {
          return null;
        }
      },
    }),
    {
      name: 'kinal-break-mobile-auth',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
