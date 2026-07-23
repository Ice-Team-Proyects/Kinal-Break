// src/shared/store/cartStore.js

import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cartItems: [],

  addToCart: (product, quantity = 1, accompaniment = null) => {
    const currentItems = get().cartItems;
    const existingIndex = currentItems.findIndex(
      (item) =>
        item.product._id === product._id &&
        ((!item.accompaniment && !accompaniment) ||
          item.accompaniment?._id === accompaniment?._id)
    );

    if (existingIndex > -1) {
      const updated = [...currentItems];
      updated[existingIndex].quantity += quantity;
      set({ cartItems: updated });
    } else {
      const newItem = {
        id: `${product._id}_${accompaniment ? accompaniment._id : 'none'}_${Date.now()}`,
        product,
        quantity,
        accompaniment,
        unitPrice: product.price + (accompaniment ? accompaniment.price : 0),
      };
      set({ cartItems: [...currentItems, newItem] });
    }
  },

  removeFromCart: (itemId) => {
    set({ cartItems: get().cartItems.filter((item) => item.id !== itemId) });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    set({
      cartItems: get().cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    });
  },

  clearCart: () => set({ cartItems: [] }),

  getTotal: () => {
    return get().cartItems.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );
  },
}));
