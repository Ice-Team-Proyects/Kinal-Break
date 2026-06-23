import { Router } from 'express';
import { addOrder, listOrders, editOrder, removeOrder } from './order.controller.js';
import { validateMongoId } from '../../middlewares/validate-mongo-id.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireRole } from '../../middlewares/validate-role.js';

const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crea una nueva orden (USER_ROLE o ADMIN_ROLE)
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validateJWT, addOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista órdenes (ADMIN_ROLE ve todas, USER_ROLE solo las propias)
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', validateJWT, listOrders);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Actualiza estado de una orden (solo ADMIN_ROLE)
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', validateJWT, requireRole('ADMIN_ROLE'), validateMongoId, editOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Elimina una orden (solo ADMIN_ROLE)
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', validateJWT, requireRole('ADMIN_ROLE'), validateMongoId, removeOrder);

export default router;