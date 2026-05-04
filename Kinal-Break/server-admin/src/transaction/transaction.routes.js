import { Router } from 'express';
import { 
    registrarPago, 
    listarTransacciones, 
    obtenerTransaccionUnica 
} from './transaction.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateCreateTransaction, validateTransactionId } from '../../middlewares/transaction.validator.js';

const router = Router();

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Registra una nueva transacción
 *     description: Crea un registro de transacción vinculado a un pago específico.
 *     tags: [Transacciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: string
 *                 description: ID de MongoDB del pago asociado a la transacción
 *               total:
 *                 type: number
 *                 description: Monto total de la transacción (debe ser mayor o igual a 0)
 *                 example: 150.50
 *               status:
 *                 type: string
 *                 description: Estado actual de la transacción
 *                 enum: [Pendiente, Completado, Cancelado]
 *                 example: Completado
 *     responses:
 *       201:
 *         description: Transacción registrada exitosamente.
 *       400:
 *         description: Error de validación en los campos enviados.
 *       401:
 *         description: No autorizado (Falta token o es inválido).
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', [validateJWT, validateCreateTransaction], registrarPago);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Lista todas las transacciones
 *     description: Devuelve un arreglo con el historial de todas las transacciones registradas.
 *     tags: [Transacciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transacciones obtenida correctamente.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error interno del servidor al obtener las transacciones.
 */
router.get('/', [validateJWT], listarTransacciones);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Obtiene una transacción específica
 *     description: Busca y devuelve los detalles de una sola transacción utilizando su ID.
 *     tags: [Transacciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de Mongo válido de la transacción a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transacción encontrada exitosamente.
 *       400:
 *         description: El ID proporcionado no es válido.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: No se encontró la transacción con ese ID.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', [validateJWT, validateTransactionId], obtenerTransaccionUnica);

export default router;