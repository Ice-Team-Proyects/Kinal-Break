import Order from './order.model.js';

export const createOrder = async (data) => {
    const newOrder = new Order(data);
    return await newOrder.save();
};

export const getOrders = async (query) => {
    const filtros = { activo: true }; 
    
    if (query.estado) {
        filtros.estado = query.estado;
    }
    if (query.usuarioId) {
        filtros.usuarioId = query.usuarioId;
    }

    return await Order.find(filtros).sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId, nuevoEstado, confirmacionDoble) => {
    const estadosPermitidos = ['Pendiente', 'Pagado', 'Entregado', 'No pagado'];
    
    if (!estadosPermitidos.includes(nuevoEstado)) {
        throw new Error('Estado inválido');
    }
    
    if (nuevoEstado === 'No pagado' && confirmacionDoble !== true) {
        throw new Error('ALERTA_DOBLE_CONFIRMACION');
    }

    const order = await Order.findOneAndUpdate(
        { _id: orderId, activo: true }, 
        { estado: nuevoEstado }, 
        { new: true }
    );
    
    if (!order) {
        throw new Error('Pedido no encontrado o fue eliminado');
    }
    
    return order;
};

export const softDeleteOrder = async (orderId) => {
    const order = await Order.findByIdAndUpdate(
        orderId,
        { activo: false },
        { new: true }
    );
    
    if (!order) {
        throw new Error('Pedido no encontrado');
    }
    
    return order;
};