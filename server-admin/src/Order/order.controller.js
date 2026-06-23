import * as OrderService from './order.service.js';

export const addOrder = async (req, res) => {
    try {
        const body = { ...req.body };
        // USER_ROLE can only create orders for themselves
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
        // USER_ROLE can only see their own orders
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