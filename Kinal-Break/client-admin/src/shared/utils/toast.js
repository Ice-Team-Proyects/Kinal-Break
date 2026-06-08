import toast from 'react-hot-toast';

const base = {
  borderRadius: '10px',
  fontWeight: 600,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.95rem',
  padding: '14px 20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
};

export const showSuccess = (msg) =>
  toast.success(msg, {
    style: { ...base, background: 'linear-gradient(90deg,#22c55e,#16a34a)', color: '#fff', border: '2px solid #22c55e' },
    iconTheme: { primary: '#fff', secondary: '#22c55e' },
  });

export const showError = (msg) =>
  toast.error(msg, {
    style: { ...base, background: 'linear-gradient(90deg,#ef4444,#b91c1c)', color: '#fff', border: '2px solid #ef4444' },
    iconTheme: { primary: '#fff', secondary: '#ef4444' },
  });

export const showInfo = (msg) =>
  toast(msg, {
    style: { ...base, background: 'linear-gradient(90deg,#ea580c,#dc2626)', color: '#fff', border: '2px solid #ea580c' },
  });