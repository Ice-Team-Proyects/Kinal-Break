import Order from './order.model.js';
import Cart from './cart.model.js';
import Product from '../Products/product.model.js';
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (data) => {
    if (!data.numeroPedido) {
        data.numeroPedido = uuidv4();
    }
    const newOrder = new Order(data);
    return await newOrder.save();
};

export const getOrders = async (query) => {
    const filtros = { activo: { $ne: false } };
    
    if (query.estado) {
        filtros.estado = query.estado;
    }
    if (query.usuarioId) {
        filtros.usuarioId = query.usuarioId;
    }

    return await Order.find(filtros)
        .populate('productos.productoId', 'name price photo category')
        .populate('productos.acompanamientoId', 'name')
        .sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId, nuevoEstado, confirmacionDoble) => {
    const estadosPermitidos = ['Pendiente', 'Pagado', 'Entregado', 'No pagado', 'Cancelado'];
    
    if (!estadosPermitidos.includes(nuevoEstado)) {
        throw new Error('Estado inválido');
    }
    
    if (nuevoEstado === 'No pagado' && confirmacionDoble !== true) {
        throw new Error('ALERTA_DOBLE_CONFIRMACION');
    }

    const order = await Order.findOneAndUpdate(
        { _id: orderId, activo: { $ne: false } }, 
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

export const getCart = async (usuarioId) => {
    const cart = await Cart.findOne({ usuarioId })
        .populate('productos.productoId', 'name price photo category allowAccompaniments accompaniments')
        .populate('productos.acompanamientoId', 'name');
    if (!cart) {
        return { productos: [], totalTemporal: 0 };
    }
    return cart;
};

export const addToCart = async (usuarioId, { productoId, cantidad, acompanamientoId }) => {
    const product = await Product.findById(productoId).populate('accompaniments', 'name');
    if (!product || !product.isActive || product.isDeleted) {
        throw new Error('Producto no disponible');
    }

    if (acompanamientoId) {
        const accompaniment = await Product.findById(acompanamientoId);
        if (!accompaniment || !accompaniment.isActive || accompaniment.isDeleted) {
            throw new Error('Acompañamiento no disponible');
        }
    }

    let cart = await Cart.findOne({ usuarioId });
    const item = {
        productoId,
        cantidad,
        precioUnitario: product.price,
        acompanamientoId: acompanamientoId || null
    };

    if (!cart) {
        cart = new Cart({
            usuarioId,
            productos: [item],
            totalTemporal: product.price * cantidad
        });
    } else {
        cart.productos.push(item);
        cart.totalTemporal += (product.price * cantidad);
    }

    return await cart.save();
};

export const confirmOrderFromCart = async (usuarioId) => {
    const pedidoPendientePago = await Order.findOne({
        usuarioId,
        estado: 'No pagado',
        activo: { $ne: false }
    });

    if (pedidoPendientePago) {
        throw new Error('USUARIO_PENALIZADO');
    }

    const cart = await Cart.findOne({ usuarioId });
    if (!cart || cart.productos.length === 0) {
        throw new Error('El carrito está vacío');
    }

    for (const item of cart.productos) {
        const product = await Product.findById(item.productoId);
        if (!product || !product.isActive || product.isDeleted) {
            throw new Error('Uno o más productos de tu carrito ya no están disponibles');
        }
    }

    const orderData = {
        numeroPedido: uuidv4(),
        usuarioId: cart.usuarioId,
        productos: cart.productos.map(item => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            acompanamientoId: item.acompanamientoId || null
        })),
        totalCobrar: cart.totalTemporal,
        totalFinal: cart.totalTemporal,
        estado: 'Pendiente'
    };

    const newOrder = new Order(orderData);
    await newOrder.save();
    await Cart.findOneAndDelete({ usuarioId });
    return newOrder;
};

export const getUserHistory = async (usuarioId) => {
    return await Order.find({ usuarioId, activo: { $ne: false } })
        .populate('productos.productoId', 'name price photo category')
        .populate('productos.acompanamientoId', 'name')
        .sort({ createdAt: -1 });
};

export const cancelUserOrder = async (usuarioId, orderId) => {
    const order = await Order.findOneAndUpdate(
        { _id: orderId, usuarioId, estado: 'Pendiente', activo: { $ne: false } },
        { estado: 'Cancelado' },
        { new: true }
    );
    if (!order) {
        throw new Error('Pedido no encontrado o ya procesado');
    }
    return order;
};

export const cleanExpiredOrders = async () => {
    const timeLimit = new Date(Date.now() - 30 * 60000);
    const result = await Order.updateMany(
        { estado: 'Pendiente', createdAt: { $lt: timeLimit } },
        { $set: { estado: 'Cancelado' } }
    );
    return result.modifiedCount;
};

export const getUserPenaltyStatus = async (usuarioId) => {
    const pedido = await Order.findOne({
        usuarioId,
        estado: 'No pagado',
        activo: { $ne: false }
    });
    return {
        penalizado: !!pedido,
        pedidoId: pedido?._id || null,
        numeroPedido: pedido?.numeroPedido || null
    };
};