import { create } from 'zustand';
import { pedidosAxios } from '../../../shared/api/axios';
import toast from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
  cartItems: [],
  totalTemporal: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await pedidosAxios.get('/carrito');
      const cart = response.data?.carrito || { productos: [], totalTemporal: 0 };
      set({ 
        cartItems: cart.productos || [], 
        totalTemporal: cart.totalTemporal || 0 
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productoId, cantidad, acompanamientoId, horaReserva) => {
    set({ isLoading: true });
    try {
      await pedidosAxios.post('/carrito', {
        productoId,
        cantidad,
        acompanamientoId,
        horaReserva,
      });
      toast.success('Producto agregado al carrito');
      get().fetchCart();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || error.response?.data?.message || 'Error al agregar al carrito');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromCart: async (itemId) => {
    set({ isLoading: true });
    try {
      await pedidosAxios.delete(`/carrito/${itemId}`);
      toast.success('Producto eliminado');
      get().fetchCart();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || 'No se pudo eliminar el ítem');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  confirmOrder: async ({ metodoPago = 'Efectivo', horaReserva, comprobanteFile } = {}) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append('metodoPago', metodoPago);
      if (horaReserva) formData.append('horaReserva', horaReserva);
      if (comprobanteFile) formData.append('comprobante', comprobanteFile);

      await pedidosAxios.post('/confirmar', formData);
      toast.success('Pedido confirmado con éxito');
      set({ cartItems: [], totalTemporal: 0 });
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || error.response?.data?.message || 'Error al confirmar pedido');
      return false;
    } finally {
      set({ isLoading: false });
    }
  }
}));
