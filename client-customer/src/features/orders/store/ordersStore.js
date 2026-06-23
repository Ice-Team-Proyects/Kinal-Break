import { create } from 'zustand';
import { pedidosAxios } from '../../../shared/api/axios';
import toast from 'react-hot-toast';

export const useOrdersStore = create((set, get) => ({
  ordersHistory: [],
  isLoading: false,

  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const response = await pedidosAxios.get('/historial');
      set({ ordersHistory: response.data?.pedidos || [] });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  cancelOrder: async (id) => {
    try {
      await pedidosAxios.delete(`/cancelar/${id}`);
      toast.success('Pedido cancelado correctamente');
      get().fetchHistory();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'No se puede cancelar el pedido');
      return false;
    }
  }
}));
