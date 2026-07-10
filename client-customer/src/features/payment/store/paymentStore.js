import { create } from 'zustand';
import { createCheckoutSessionRequest, getPaymentSessionRequest, getOrderByIdRequest } from '../../../shared/api/paymentApi.js';
import toast from 'react-hot-toast';

export const usePaymentStore = create((set) => ({
  order: null,
  paymentStatus: 'pending',
  isLoading: false,
  isPaying: false,

  fetchOrder: async (orderId) => {
    set({ isLoading: true });
    try {
      const response = await getOrderByIdRequest(orderId);
      set({ order: response.data.data });
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cargar la orden');
    } finally {
      set({ isLoading: false });
    }
  },

  createCheckoutSession: async (orderId) => {
    set({ isPaying: true });
    try {
      const response = await createCheckoutSessionRequest(orderId);
      return response.data.sessionId;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al iniciar el pago');
      return null;
    } finally {
      set({ isPaying: false });
    }
  },

  fetchPaymentStatus: async (sessionId) => {
    try {
      const response = await getPaymentSessionRequest(sessionId);
      set({ paymentStatus: response.data.payment.status });
      return response.data.payment.status;
    } catch (error) {
      console.error(error);
      toast.error('No se pudo verificar el pago');
      return null;
    }
  }
}));
