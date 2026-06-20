import { create } from 'zustand';
import { 
  getPaymentsRequest, 
  createPaymentRequest, 
  deletePaymentRequest, 
  setPaymentUnpaidRequest 
} from '../../../shared/api/adminApi';
import toast from 'react-hot-toast';

export const usePaymentsStore = create((set, get) => ({
  payments: [],
  isLoading: false,

  fetchPayments: async () => {
    set({ isLoading: true });
    try {
      const res = await getPaymentsRequest();
      set({ payments: res.data.data || res.data || [] });
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar pagos');
    } finally {
      set({ isLoading: false });
    }
  },

  createPayment: async (paymentData) => {
    set({ isLoading: true });
    try {
      await createPaymentRequest(paymentData);
      toast.success('Pago registrado correctamente');
      get().fetchPayments();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error al procesar el pago');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  deletePayment: async (id) => {
    try {
      await deletePaymentRequest(id);
      toast.success('Pago anulado con éxito');
      get().fetchPayments();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error al anular pago');
      return false;
    }
  },

  setPaymentUnpaid: async (id, confirm = true) => {
    try {
      await setPaymentUnpaidRequest(id, { confirm });
      toast.success('Pago marcado como No Pagado');
      get().fetchPayments();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Error al actualizar pago');
      return false;
    }
  }
}));
