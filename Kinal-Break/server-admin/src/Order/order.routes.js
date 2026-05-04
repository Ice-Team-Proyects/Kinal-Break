import { Router } from 'express';
import { addOrder, listOrders, editOrder, removeOrder } from './order.controller.js';
import { validateMongoId } from '../../middlewares/validate-mongo-id.js';

const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crea una nueva orden
 *     description: Registra una nueva orden en el sistema de la cafetería.
 *     tags: [Órdenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario que realiza la orden
 *               products:
 *                 type: array
 *                 description: Lista de productos en la orden
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID del producto
 *                     quantity:
 *                       type: integer
 *                       description: Cantidad solicitada
 *               total:
 *                 type: number
 *                 description: Total a pagar por la orden
 *     responses:
 *       201:
 *         description: Orden creada exitosamente.
 *       400:
 *         description: Error en los datos enviados.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', addOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todas las órdenes
 *     description: Obtiene un arreglo con todas las órdenes registradas en el sistema.
 *     tags: [Órdenes]
 *     responses:
 *       200:
 *         description: Lista de órdenes obtenida correctamente.
 *       500:
 *         description: Error interno del servidor al buscar las órdenes.
 */
router.get('/', listOrders);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Actualiza una orden existente
 *     description: Modifica los datos de una orden (como su estado) utilizando su ID de MongoDB.
 *     tags: [Órdenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de Mongo válido de la orden a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Nuevo estado de la orden (ej. Pendiente, Preparando, Entregado)
 *                 example: Preparando
 *     responses:
 *       200:
 *         description: Orden actualizada correctamente.
 *       400:
 *         description: El ID proporcionado no es un MongoID válido.
 *       404:
 *         description: No se encontró la orden con ese ID.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:id', validateMongoId, editOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Elimina una orden
 *     description: Cancela o elimina lógicamente una orden del sistema mediante su ID.
 *     tags: [Órdenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de Mongo válido de la orden a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden eliminada exitosamente.
 *       400:
 *         description: El ID proporcionado no es un MongoID válido.
 *       404:
 *         description: No se encontró la orden para eliminar.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/:id', validateMongoId, removeOrder);

export default router;