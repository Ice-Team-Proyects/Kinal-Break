import { create } from 'zustand';
import { pedidosAxios } from '../../../shared/api/axios';
import toast from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
  cartItems: [],
  totalTemporal: 0,
  isLoading: false,
  penalizado: false,

  checkPenalty: async () => {
    try {
      const response = await pedidosAxios.get('/estado-penalizacion');
      set({ penalizado: response.data?.penalizado || false });
      return response.data?.penalizado || false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

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

  addToCart: async (productoId, cantidad, acompanamientoId) => {
    set({ isLoading: true });
    try {
      await pedidosAxios.post('/carrito', { productoId, cantidad, acompanamientoId });
      toast.success('Producto agregado al carrito');
      get().fetchCart();
    } catch (error) {
      console.error(error);
      toast.error('Error al agregar al carrito');
    } finally {
      set({ isLoading: false });
    }
  },

  confirmOrder: async () => {
    set({ isLoading: true });
    try {
      await pedidosAxios.post('/confirmar');
      toast.success('Pedido confirmado con éxito');
      set({ cartItems: [], totalTemporal: 0 });
      return { success: true };
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403 && error.response?.data?.penalizado) {
        set({ penalizado: true });
        toast.error('Tienes un pedido sin pagar. No puedes hacer nuevos pedidos.', { duration: 5000 });
        return { success: false, penalizado: true };
      }
      toast.error(error.response?.data?.msg || 'Error al confirmar pedido');
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  }
}));