// src/features/menu/hooks/useMenu.js

import { useState, useCallback, useEffect } from 'react';
import { menuClient } from '../../../shared/api/menuClient.js';

export function useMenu() {
  const [products, setProducts] = useState([]);
  const [accompaniments, setAccompaniments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenuData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, accRes] = await Promise.all([
        menuClient.get('/products', { params }),
        menuClient.get('/accompaniment'),
      ]);

      const rawProds = prodRes.data?.data || prodRes.data || [];
      const rawAccs = accRes.data?.data || accRes.data || [];

      setProducts(Array.isArray(rawProds) ? rawProds : []);
      setAccompaniments(Array.isArray(rawAccs) ? rawAccs : []);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || 'Error al cargar el menú';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  const createProduct = async (productData) => {
    try {
      const res = await menuClient.post('/products', productData);
      await fetchMenuData();
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || 'Error al crear platillo';
      return { success: false, error: msg };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await menuClient.put(`/products/${id}`, productData);
      await fetchMenuData();
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || 'Error al actualizar platillo';
      return { success: false, error: msg };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await menuClient.patch(`/products/delete/${id}`);
      await fetchMenuData();
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || 'Error al eliminar platillo';
      return { success: false, error: msg };
    }
  };

  return {
    products,
    accompaniments,
    loading,
    error,
    refreshMenu: fetchMenuData,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
