import * as OrderService from './order.service.js';
import { broadcast } from '../events/sse.js';

export const addOrder = async (req, res) => {
    try {
        const body = { ...req.body };
        if (req.user && req.user.role === 'USER_ROLE') {
            body.usuarioId = req.user.id;
        }
        const order = await OrderService.createOrder(body);
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};

export const listOrders = async (req, res) => {
    try {
        const query = { ...req.query };
        if (req.user && req.user.role === 'USER_ROLE') {
            query.usuarioId = req.user.id;
        }
        const orders = await OrderService.getOrders(query);
        res.status(200).json({ success: true, total: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const editOrder = async (req, res) => {
    try {
        const { estado, confirmacionDoble } = req.body;
        const order = await OrderService.updateOrderStatus(req.params.id, estado, confirmacionDoble);
        broadcast('orders', { action: 'statusUpdated', order });
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        if (error.message === 'ALERTA_DOBLE_CONFIRMACION') {
            return res.status(400).json({ 
                success: false, 
                msg: 'Se requiere enviar confirmacionDoble: true para marcar como No pagado.' 
            });
        }
        res.status(400).json({ success: false, msg: error.message });
    }
};

export const removeOrder = async (req, res) => {
    try {
        await OrderService.softDeleteOrder(req.params.id);
        res.status(200).json({ success: true, msg: 'Pedido eliminado lógicamente' });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};

export const obtenerCarrito = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const carrito = await OrderService.getCart(usuarioId);
        res.status(200).json({ success: true, carrito });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const agregarAlCarrito = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { productoId, cantidad, acompanamientoId } = req.body;
        const carrito = await OrderService.addToCart(usuarioId, { productoId, cantidad, acompanamientoId });
        res.status(200).json({ success: true, carrito });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const confirmarPedido = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const pedido = await OrderService.confirmOrderFromCart(usuarioId);
        broadcast('orders', { action: 'created', order: pedido });
        res.status(201).json({ success: true, message: 'Pedido confirmado', pedido });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};

export const obtenerHistorial = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const pedidos = await OrderService.getUserHistory(usuarioId);
        res.status(200).json({ success: true, pedidos });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const cancelarPedido = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const pedido = await OrderService.cancelUserOrder(usuarioId, id);
        broadcast('orders', { action: 'cancelled', order: pedido });
        res.status(200).json({ success: true, pedido });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};

export const limpiarPedidosExpirados = async (req, res) => {
    try {
        const count = await OrderService.cleanExpiredOrders();
        res.status(200).json({ 
            success: true, 
            message: `Limpieza ejecutada. Se cancelaron ${count} pedidos expirados.` 
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};