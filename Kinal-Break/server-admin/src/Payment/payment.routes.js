import { Router } from "express";
import { validateCreatePayment, validatePaymentId } from "../../middlewares/payment.validator.js";
import {
    createPayment,
    getPayments,
    getPaymentByOrder,
    financialReport,
    removePayment,
    restorePaymentController,
    setUnpaid
} from "./payment.controller.js";

const router = Router();

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Crea un nuevo registro de pago
 *     description: Registra un pago en el sistema vinculado a una orden específica.
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID de la orden que se está pagando
 *               amount:
 *                 type: number
 *                 description: Cantidad total del pago
 *                 example: 150.50
 *               method:
 *                 type: string
 *                 description: Método de pago utilizado (ej. Efectivo, Tarjeta)
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente.
 *       400:
 *         description: Error de validación en los datos ingresados.
 *       500:
 *         description: Error interno del servidor al procesar el pago.
 */
router.post("/", validateCreatePayment, createPayment);

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Lista todos los pagos
 *     description: Obtiene un listado de todos los pagos registrados (que no estén eliminados).
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", getPayments);

/**
 * @swagger
 * /payments/order/{orderId}:
 *   get:
 *     summary: Obtiene un pago por ID de orden
 *     description: Busca y devuelve el pago asociado a una orden en específico.
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID de la orden a consultar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago encontrado exitosamente.
 *       404:
 *         description: No se encontró ningún pago para esa orden.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/order/:orderId", getPaymentByOrder);

/**
 * @swagger
 * /payments/report/financial:
 *   get:
 *     summary: Genera un reporte financiero
 *     description: Obtiene un reporte agregado con el total de ventas y transacciones.
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Reporte financiero generado exitosamente.
 *       500:
 *         description: Error al generar el reporte.
 */
router.get("/report/financial", financialReport);

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Cancela/Elimina un pago
 *     description: Realiza una eliminación lógica (isDeleted) de un registro de pago mediante su ID.
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de Mongo del pago a cancelar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago cancelado exitosamente.
 *       400:
 *         description: El ID proporcionado no es válido.
 *       500:
 *         description: Error al intentar cancelar el pago.
 */
router.delete("/:id", validatePaymentId, removePayment);

/**
 * @swagger
 * /payments/restore/{id}:
 *   patch:
 *     summary: Restaura un pago cancelado
 *     description: Revierte la eliminación lógica de un pago utilizando su ID.
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de Mongo del pago a restaurar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago restaurado exitosamente.
 *       400:
 *         description: El ID proporcionado no es válido.
 *       500:
 *         description: Error al intentar restaurar el pago.
 */
router.patch("/restore/:id", validatePaymentId, restorePaymentController);

/**
 * @swagger
 * /payments/unpaid/{id}:
 *   patch:
 *     summary: Marca un pago como No Pagado
 *     description: Actualiza el estado de un pago a 'No Pagado', requiere confirmación en el cuerpo de la petición.
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de Mongo del pago
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirm:
 *                 type: boolean
 *                 description: Confirmación requerida para marcar como no pagado
 *                 example: true
 *     responses:
 *       200:
 *         description: Estado del pago actualizado exitosamente.
 *       400:
 *         description: Faltó la confirmación o el ID es inválido.
 *       500:
 *         description: Error interno del servidor.
 */
router.patch("/unpaid/:id", validatePaymentId, setUnpaid);

export default router;