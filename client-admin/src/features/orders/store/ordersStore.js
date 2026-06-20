import { create } from 'zustand';
import { 
  getOrdersRequest, 
  updateOrderStatusRequest, 
  deleteOrderRequest 
} from '../../../shared/api/adminApi';
import toast from 'react-hot-toast';

export const useOrdersStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  filters: { estado: '', usuarioId: '' },

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().fetchOrders();
  },

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const { filters } = get();
      const res = await getOrdersRequest(filters);
      set({ orders: Array.isArray(res.data?.data) ? res.data.data : [] });
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar pedidos');
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (id, estado, confirmacionDoble = false) => {
    try {
      await updateOrderStatusRequest(id, { estado, confirmacionDoble });
      toast.success(`Pedido actualizado a: ${estado}`);
      get().fetchOrders();
      return { success: true };
    } catch (err) {
      console.error(err);
      if (err.response?.data?.msg === 'Se requiere enviar confirmacionDoble: true para marcar como No pagado.') {
        return { success: false, requireDoubleConfirm: true };
      }
      toast.error(err.response?.data?.msg || 'Error al actualizar el estado del pedido');
      return { success: false };
    }
  },

  deleteOrder: async (id) => {
    try {
      await deleteOrderRequest(id);
      toast.success('Pedido cancelado/eliminado');
      get().fetchOrders();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error al cancelar pedido');
      return false;
    }
  }
}));
