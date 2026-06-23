import { useEffect, useRef } from 'react';
import { useMenuStore } from '../../features/menu/store/menuStore';
import { useOrdersStore } from '../../features/orders/store/ordersStore';

const SSE_URL = `${import.meta.env.VITE_API_URL}/events`;

export function useSSE() {
    const esRef = useRef(null);

    useEffect(() => {
        const es = new EventSource(SSE_URL);
        esRef.current = es;

        es.addEventListener('products', () => {
            useMenuStore.getState().fetchProducts();
        });

        es.addEventListener('accompaniments', () => {
            useMenuStore.getState().fetchProducts();
        });

        es.addEventListener('orders', (e) => {
            const { order } = JSON.parse(e.data);
            useOrdersStore.setState((state) => ({
                ordersHistory: state.ordersHistory.map((o) =>
                    o._id === order._id ? { ...o, estado: order.estado } : o
                ),
            }));
        });

        return () => {
            es.close();
        };
    }, []);
}
