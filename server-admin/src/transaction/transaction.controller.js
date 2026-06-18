import * as transactionService from './transaction.service.js';

export const registrarPago = async (req, res) => {
    try {
        // Tomamos el usuario del token (si el middleware de JWT lo inyecta) o del body
        const usuarioId = req.user?.id || req.body.usuarioId; 
        const { pedidoId, montoFinal, metodoPago, referencia } = req.body;

        const transaccion = await transactionService.crearTransaccion({
            pedidoId,
            usuarioId,
            montoFinal,
            metodoPago,
            referencia,
            estado: 'Completado'
        });

        res.status(201).json({
            success: true,
            message: "Transacción registrada exitosamente",
            transaction: transaccion
        });
    } catch (error) {
        console.error("Error en registrarPago:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error al registrar la transacción", 
            error: error.message 
        });
    }
};

export const listarTransacciones = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const data = await transactionService.obtenerTransacciones(limite, desde);

        res.status(200).json({
            success: true,
            message: "Transacciones obtenidas correctamente",
            data
        });
    } catch (error) {
        console.error("Error en listarTransacciones:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error al obtener el historial de transacciones", 
            error: error.message 
        });
    }
};

export const obtenerTransaccionUnica = async (req, res) => {
    try {
        const { id } = req.params;
        const transaccion = await transactionService.obtenerTransaccionPorId(id);

        if (!transaccion) {
            return res.status(404).json({ success: false, message: "Transacción no encontrada en el sistema" });
        }

        res.status(200).json({ success: true, transaccion });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al buscar la transacción", error: error.message });
    }
};