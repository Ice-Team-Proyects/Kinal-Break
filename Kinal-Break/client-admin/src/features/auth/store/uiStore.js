import { create } from 'zustand';

export const useUIStore = create((set) => ({
  confirm: null,
  openConfirm: ({ title, message, onConfirm, onCancel }) =>
    set({ confirm: { title, message, onConfirm, onCancel } }),
  closeConfirm: () => set({ confirm: null }),
}));