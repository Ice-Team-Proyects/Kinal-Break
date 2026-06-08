import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './router/AppRouter.jsx';
import { useAuthStore } from '../features/auth/store/authStore.js';
import { UiConfirmHost } from '../features/auth/components/ConfirmModal.jsx';

export const App = () => {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  useEffect(() => { checkAuth(); }, [checkAuth]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: '0.95rem',
            borderRadius: '10px',
          },
        }}
      />
      <UiConfirmHost />
      <AppRouter />
    </>
  );
};