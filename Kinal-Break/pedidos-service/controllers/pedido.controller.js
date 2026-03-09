import { Carrito, Pedido } from '../models/pedido.model.js';
import Product from '../models/product.model.js'; 

// --- 1. AGREGAR AL CARRITO ---
export const agregarAlCarrito = async (req, res) => {
    console.log("--- INICIANDO PRUEBA NUCLEAR ---");
    console.log("1. ID que viene de Postman:", req.body.productoId);

    // Le pedimos a Mongoose que nos traiga TODOS los productos sin filtros
    const todosLosProductos = await Product.find();
    console.log("2. Total de productos que mi código puede ver:", todosLosProductos.length);
    console.log("3. ¿Cuáles son?:", todosLosProductos);
    try {
        const usuarioId = req.user.id; // Viene del JWT
        const { productoId, cantidad } = req.body;

        // 1. Verificar que el producto exista y esté activo
        const producto = await Product.findById(productoId);
        if (!producto || !producto.isActive || producto.isDeleted) {
            return res.status(404).json({ success: false, message: "Producto no disponible" });
        }

        // 2. Buscar si el usuario ya tiene un carrito
        let carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            // Crear nuevo carrito
            carrito = new Carrito({
                usuarioId,
                productos: [{ productoId, cantidad, precioUnitario: producto.price }],
                totalTemporal: producto.price * cantidad
            });
        } else {
            // Actualizar carrito existente (Lógica simplificada para el ejemplo)
            carrito.productos.push({ productoId, cantidad, precioUnitario: producto.price });
            carrito.totalTemporal += (producto.price * cantidad);
        }

        await carrito.save();
        res.status(200).json({ success: true, carrito });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 2. CONFIRMAR PEDIDO (CON VALIDACIÓN DE TIEMPO) ---
export const confirmarPedido = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        // --- VALIDACIÓN DE HORARIO ---
        const ahora = new Date();
        const hora = ahora.getHours();
        const minutos = ahora.getMinutes();
        const tiempoDecimal = hora + (minutos / 60);

        const HORA_INICIO = 15.0; // 15:00 PM
        const HORA_FIN = 15 + (20/60);  // 15:20 PM

      /*  if (tiempoDecimal < HORA_INICIO || tiempoDecimal > HORA_FIN) {
            return res.status(403).json({ 
                success: false, 
                message: "Fuera de horario. Los pedidos solo se aceptan de 6:00 AM a 9:45 AM." 
            });
        } */

        // 1. Obtener el carrito del usuario
        const carrito = await Carrito.findOne({ usuarioId });
        if (!carrito || carrito.productos.length === 0) {
            return res.status(400).json({ success: false, message: "El carrito está vacío" });
        }

        // 2. Crear el Pedido Final
        const nuevoPedido = new Pedido({
            usuarioId: carrito.usuarioId,
            productos: carrito.productos,
            totalFinal: carrito.totalTemporal
        });

        await nuevoPedido.save();

        // 3. Vaciar/Eliminar el carrito temporal
        await Carrito.findOneAndDelete({ usuarioId });

        res.status(201).json({ 
            success: true, 
            message: "Pedido confirmado exitosamente",
            pedido: nuevoPedido 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 3. OBTENER HISTORIAL DE PEDIDOS ---
export const obtenerHistorial = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        
        const pedidos = await Pedido.find({ usuarioId }).sort({ fechaCreacion: -1 });
        
        res.status(200).json({ success: true, pedidos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 4. CANCELAR PEDIDO ---
export const cancelarPedido = async (req, res) => {
    try {
        const { numeroPedido } = req.params; 
        const usuarioId = req.user.id;

        const pedido = await Pedido.findOne({ numeroPedido, usuarioId });

        if (!pedido) {
            return res.status(404).json({ success: false, message: "Pedido no encontrado" });
        }

        // Regla de negocio: Solo se pueden cancelar pedidos que estén 'Pendiente'
        if (pedido.estado !== 'Pendiente') {
            return res.status(400).json({ 
                success: false, 
                message: `No se puede cancelar un pedido que ya está ${pedido.estado}` 
            });
        }

        pedido.estado = 'Cancelado';
        await pedido.save();

        res.status(200).json({ success: true, message: "Pedido cancelado exitosamente", pedido });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};