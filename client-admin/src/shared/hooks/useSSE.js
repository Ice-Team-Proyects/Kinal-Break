import { useEffect, useRef } from 'react';
import { useOrdersStore } from '../../features/orders/store/ordersStore';
import { useProductsStore } from '../../features/products/store/productsStore';
import { useAccompanimentsStore } from '../../features/accompaniments/store/accompanimentsStore';
import { usePaymentsStore } from '../../features/payments/store/paymentsStore';
import { useReportsStore } from '../../features/reports/store/reportsStore';

const SSE_URL = `${import.meta.env.VITE_ADMIN_URL || import.meta.env.VITE_API_URL}/events`;

export function useSSE() {
    const esRef = useRef(null);

    useEffect(() => {
        const es = new EventSource(SSE_URL);
        esRef.current = es;

        es.addEventListener('orders', () => {
            useOrdersStore.getState().fetchOrders();
        });

        es.addEventListener('products', () => {
            useProductsStore.getState().fetchProducts();
        });

        es.addEventListener('accompaniments', () => {
            useAccompanimentsStore.getState().fetchAccompaniments();
        });

        es.addEventListener('payments', () => {
            usePaymentsStore.getState().fetchPayments();
            useReportsStore.getState().fetchAllReports();
        });

        return () => {
            es.close();
        };
    }, []);
}
