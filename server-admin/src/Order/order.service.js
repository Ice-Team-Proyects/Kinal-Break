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

export const addToCart = async (usuarioId, { productoId, cantidad, acompanamientoId, horaReserva }) => {
    const product = await Product.findById(productoId).populate('accompaniments', 'name');
    if (!product || !product.isActive || product.isDeleted) {
        throw new Error('Producto no disponible');
    }

    if (product.category === 'complementos') {
        throw new Error('Los complementos solo se pueden elegir como acompañamiento de un desayuno o almuerzo');
    }

    if (acompanamientoId) {
        const accompaniment = await Product.findById(acompanamientoId);
        if (!accompaniment || !accompaniment.isActive || accompaniment.isDeleted) {
            throw new Error('Acompañamiento no disponible');
        }
        if (accompaniment.category !== 'complementos') {
            throw new Error('El acompañamiento seleccionado no es válido');
        }
    }

    if (product.allowAccompaniments && Array.isArray(product.accompaniments) && product.accompaniments.length > 0 && !acompanamientoId) {
        throw new Error('Debes seleccionar un acompañamiento');
    }

    const isMeal = product.category === 'desayunos' || product.category === 'almuerzos';
    if (isMeal && !horaReserva) {
        throw new Error('Debes indicar la hora de reserva para desayunos y almuerzos');
    }

    let cart = await Cart.findOne({ usuarioId });
    const item = {
        productoId,
        cantidad,
        precioUnitario: product.price,
        acompanamientoId: acompanamientoId || null,
        horaReserva: isMeal ? horaReserva : null
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

export const removeFromCart = async (usuarioId, itemId) => {
    const cart = await Cart.findOne({ usuarioId });
    if (!cart) {
        throw new Error('El carrito está vacío');
    }

    const item = cart.productos.id(itemId);
    if (!item) {
        throw new Error('Ítem no encontrado en el carrito');
    }

    cart.totalTemporal = Math.max(0, cart.totalTemporal - (item.precioUnitario * item.cantidad));
    item.deleteOne();
    await cart.save();
    return cart;
};

export const confirmOrderFromCart = async (usuarioId, { metodoPago, horaReserva, comprobanteUrl } = {}) => {
    const cart = await Cart.findOne({ usuarioId });
    if (!cart || cart.productos.length === 0) {
        throw new Error('El carrito está vacío');
    }

    const metodo = metodoPago === 'Transferencia' ? 'Transferencia' : 'Efectivo';

    if (metodo === 'Transferencia' && !comprobanteUrl) {
        throw new Error('Debes subir el comprobante de transferencia');
    }

    for (const item of cart.productos) {
        const product = await Product.findById(item.productoId);
        if (!product || !product.isActive || product.isDeleted) {
            throw new Error('Uno o más productos de tu carrito ya no están disponibles');
        }
    }

    const mealItems = cart.productos.filter((i) => i.horaReserva);
    const orderHora =
        horaReserva ||
        mealItems[0]?.horaReserva ||
        null;

    const orderData = {
        numeroPedido: uuidv4(),
        usuarioId: cart.usuarioId,
        productos: cart.productos.map(item => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            acompanamientoId: item.acompanamientoId || null,
            horaReserva: item.horaReserva || orderHora || null
        })),
        totalCobrar: cart.totalTemporal,
        totalFinal: cart.totalTemporal,
        estado: 'Pendiente',
        metodoPago: metodo,
        horaReserva: orderHora,
        comprobanteUrl: metodo === 'Transferencia' ? comprobanteUrl : null
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

export const clearUserPenalties = async (usuarioId) => {
    const result = await Order.updateMany(
        { usuarioId, estado: 'No pagado', activo: { $ne: false } },
        { $set: { estado: 'Cancelado' } }
    );
    return result.modifiedCount;
};

export const cleanExpiredOrders = async () => {
    const timeLimit = new Date(Date.now() - 30 * 60000);
    const result = await Order.updateMany(
        { estado: 'Pendiente', createdAt: { $lt: timeLimit } },
        { $set: { estado: 'Cancelado' } }
    );
    return result.modifiedCount;
};
