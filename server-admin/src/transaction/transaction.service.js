import Transaction from './transaction.model.js';

export const crearTransaccion = async (data) => {
    const nuevaTransaccion = new Transaction(data);
    return await nuevaTransaccion.save();
};

export const obtenerTransacciones = async (limite = 10, desde = 0) => {
    // Usamos Promise.all para ejecutar el conteo y la búsqueda al mismo tiempo (mejor rendimiento)
    const [total, transacciones] = await Promise.all([
        Transaction.countDocuments(),
        Transaction.find()
            .populate('pedidoId', 'estado totalFinal') // Trae los datos clave del pedido asociado
            .skip(Number(desde))
            .limit(Number(limite))
            .sort({ createdAt: -1 })
    ]);
    
    return { total, transacciones };
};

export const obtenerTransaccionPorId = async (id) => {
    return await Transaction.findById(id).populate('pedidoId');
};