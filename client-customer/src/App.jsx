import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './app/router/AppRouter';
import { useAuthStore } from './features/auth/store/authStore';

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            border: '2px solid #031633',
            padding: '12px',
            color: '#031633',
            fontFamily: 'Hanken Grotesk, sans-serif',
            fontWeight: 'bold',
            borderRadius: '16px',
            boxShadow: '4px 4px 0px 0px #031633',
          },
        }}
      />
    </BrowserRouter>
  );
}
