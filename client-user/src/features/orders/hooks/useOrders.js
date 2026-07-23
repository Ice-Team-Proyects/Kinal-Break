// src/features/orders/hooks/useOrders.js

import { useState, useCallback, useEffect } from 'react';
import { menuClient } from '../../../shared/api/menuClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useAuthStore((state) => state.user);

  const fetchMyOrders = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await menuClient.get('/orders', {
        params: { usuarioId: user.id },
      });
      const data = response.data?.data || response.data?.pedidos || response.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        'Error al cargar tu historial de pedidos';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const cancelOrder = useCallback(
    async (orderId) => {
      setLoading(true);
      setError(null);
      try {
        await menuClient.delete(`/orders/${orderId}`);
        await fetchMyOrders();
        return { success: true, message: 'Pedido cancelado correctamente' };
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.msg ||
          'No se pudo cancelar el pedido';
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [fetchMyOrders]
  );

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return {
    orders,
    loading,
    error,
    refreshOrders: fetchMyOrders,
    cancelOrder,
  };
}
