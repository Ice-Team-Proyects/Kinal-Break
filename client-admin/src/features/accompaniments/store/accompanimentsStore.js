import { create } from 'zustand';
import { 
  getAccompanimentsRequest, 
  createAccompanimentRequest, 
  updateAccompanimentRequest, 
  deleteAccompanimentRequest, 
  restoreAccompanimentRequest 
} from '../../../shared/api/adminApi';
import toast from 'react-hot-toast';

export const useAccompanimentsStore = create((set, get) => ({
  accompaniments: [],
  isLoading: false,

  fetchAccompaniments: async () => {
    set({ isLoading: true });
    try {
      const res = await getAccompanimentsRequest();
      set({ accompaniments: res.data.data || res.data || [] });
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar acompañamientos');
    } finally {
      set({ isLoading: false });
    }
  },

  createAccompaniment: async (formData) => {
    set({ isLoading: true });
    try {
      await createAccompanimentRequest(formData);
      toast.success('Acompañamiento creado');
      get().fetchAccompaniments();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error al crear acompañamiento');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAccompaniment: async (id, formData) => {
    set({ isLoading: true });
    try {
      await updateAccompanimentRequest(id, formData);
      toast.success('Acompañamiento actualizado');
      get().fetchAccompaniments();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error al actualizar acompañamiento');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAccompaniment: async (id) => {
    try {
      await deleteAccompanimentRequest(id);
      toast.success('Acompañamiento desactivado');
      get().fetchAccompaniments();
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar acompañamiento');
      return false;
    }
  },

  restoreAccompaniment: async (id) => {
    try {
      await restoreAccompanimentRequest(id);
      toast.success('Acompañamiento restaurado');
      get().fetchAccompaniments();
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Error al restaurar acompañamiento');
      return false;
    }
  }
}));
