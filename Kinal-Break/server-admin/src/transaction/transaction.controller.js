import { obtenerTodasLasTransacciones } from './transaction.service.js';

export const obtenerTransacciones = async (req, res) => {
    try {
        const transactions = await obtenerTodasLasTransacciones();
        res.status(200).json({ success: true, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};