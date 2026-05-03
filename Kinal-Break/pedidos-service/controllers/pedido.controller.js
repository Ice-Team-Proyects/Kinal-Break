import axios from 'axios'; // NO OLVIDES IMPORTAR AXIOS
import { Carrito, Pedido } from '../models/pedido.model.js';
import Product from '../models/product.model.js'; 

// 1. AGREGAR AL CARRITO (Se mantiene igual)
export const agregarAlCarrito = async (req, res) => {
    try {
        const usuarioId = req.user.id; 
        const { productoId, cantidad } = req.body;

        const producto = await Product.findById(productoId);
        if (!producto || !producto.isActive || producto.isDeleted) {
            return res.status(404).json({ success: false, message: "Producto no disponible" });
        }

        let carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            carrito = new Carrito({
                usuarioId,
                productos: [{ productoId, cantidad, precioUnitario: producto.price }],
                totalTemporal: producto.price * cantidad
            });
        } else {
            carrito.productos.push({ productoId, cantidad, precioUnitario: producto.price });
            carrito.totalTemporal += (producto.price * cantidad);
        }

        await carrito.save();
        res.status(200).json({ success: true, carrito });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. 
export const confirmarPedido = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const carrito = await Carrito.findOne({ usuarioId });

        if (!carrito || carrito.productos.length === 0) {
            return res.status(400).json({ success: false, message: "El carrito está vacío" });
        }

        for (const item of carrito.productos) {
            const productoDB = await Product.findById(item.productoId);
            if (!productoDB || !productoDB.isActive || productoDB.isDeleted) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Uno o más productos de tu carrito ya no están disponibles en cafetería." 
                });
            }
        }

        const nuevoPedido = new Pedido({
            usuarioId: carrito.usuarioId,
            productos: carrito.productos,
            totalFinal: carrito.totalTemporal,
            estado: 'Pendiente'
        });

        await nuevoPedido.save();
        await Carrito.findOneAndDelete({ usuarioId });

        res.status(201).json({ success: true, message: "Pedido confirmado", pedido: nuevoPedido });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const obtenerHistorial = async (req, res) => {
    try {
        const pedidos = await Pedido.find({ usuarioId: req.user.id }).sort({ fechaCreacion: -1 });
        res.status(200).json({ success: true, pedidos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const cancelarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await Pedido.findOneAndUpdate(
            { _id: id, usuarioId: req.user.id, estado: 'Pendiente' },
            { estado: 'Cancelado' },
            { new: true }
        );
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado o ya procesado" });
        res.status(200).json({ success: true, pedido });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const limpiarPedidosExpirados = async (req, res) => {
    try {
        const tiempoLimite = new Date(Date.now() - 30 * 60000);
        
        const resultado = await Pedido.updateMany(
            { estado: 'Pendiente', fechaCreacion: { $lt: tiempoLimite } }, 
            { $set: { estado: 'Cancelado' } }
        );

        res.status(200).json({ 
            success: true, 
            message: `Limpieza ejecutada. Se cancelaron ${resultado.modifiedCount} pedidos expirados.` 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};