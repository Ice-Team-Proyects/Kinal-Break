import { create } from 'zustand';
import { 
  getProductsRequest, 
  createProductRequest, 
  updateProductRequest, 
  deleteProductRequest, 
  restoreProductRequest 
} from '../../../shared/api/adminApi';
import toast from 'react-hot-toast';

export const useProductsStore = create((set, get) => ({
  products: [],
  isLoading: false,
  filters: { category: '', search: '' },

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().fetchProducts();
  },

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const { filters } = get();
      const res = await getProductsRequest(filters);
      // Responde con { success: true, data: [...] } o similar
      set({ products: res.data.data || res.data || [] });
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar productos');
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (formData) => {
    set({ isLoading: true });
    try {
      await createProductRequest(formData);
      toast.success('Producto creado con éxito');
      get().fetchProducts();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error al crear producto');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, formData) => {
    set({ isLoading: true });
    try {
      await updateProductRequest(id, formData);
      toast.success('Producto actualizado con éxito');
      get().fetchProducts();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error al actualizar producto');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      await deleteProductRequest(id);
      toast.success('Producto desactivado');
      get().fetchProducts();
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar producto');
      return false;
    }
  },

  restoreProduct: async (id) => {
    try {
      await restoreProductRequest(id);
      toast.success('Producto restaurado');
      get().fetchProducts();
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Error al restaurar producto');
      return false;
    }
  }
}));
