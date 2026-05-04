import {
    createPaymentRecord,
    fetchPayments,
    fetchPaymentByOrder,
    getFinancialReport,
    deletePayment, 
    markAsUnpaid   
} from "./payment.service.js";

export const createPayment = async (req, res) => {
    try {
        const payment = await createPaymentRecord(req.body);
        res.status(201).json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ success: false, message: "No Se Pudo Realizar El Pago", error: error.message });
    }
};

export const getPayments = async (req, res) => {
    try {
        const payments = await fetchPayments();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "No Se Encontro El Pago" });
    }
};

export const getPaymentByOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const payment = await fetchPaymentByOrder(orderId);
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: "No Se Pudieron Listar Los Pagos" });
    }
};

export const financialReport = async (req, res) => {
    try {
        const report = await getFinancialReport();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: "No Se Genero Correctamente El Reporte" });
    }
};

export const removePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await deletePayment(id);
        res.json({ message: "Pago Cancelado", payment });
    } catch (error) {
        res.status(500).json({ message: "No Se Pudo Cancelar El Pago" });
    }
};

export const setUnpaid = async (req, res) => {
    try {
        const { id } = req.params;
        const { confirm } = req.body;
        const payment = await markAsUnpaid(id, confirm);
        res.json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const restorePaymentController = async (req, res) => {
    try {
        res.json({ message: "Función de restaurar pago pendiente de implementar" });
    } catch (error) {
        res.status(500).json({ message: "Error al restaurar" });
    }
};