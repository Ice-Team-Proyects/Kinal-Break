import { create } from 'zustand';
import { adminAxios } from '../../../shared/api/axios';

export const useMenuStore = create((set) => ({
  products: [],
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await adminAxios.get('/products');
      const productList = response.data?.data || response.data || [];
      const activeProducts = productList.filter((product) => product.isActive && !product.isDeleted);
      set({ products: activeProducts });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
