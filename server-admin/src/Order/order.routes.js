import { Router } from 'express';
import { 
    addOrder, 
    listOrders, 
    editOrder, 
    removeOrder,
    obtenerCarrito,
    agregarAlCarrito,
    confirmarPedido,
    obtenerHistorial,
    cancelarPedido,
    limpiarPedidosExpirados,
    getOrderById
    obtenerEstadoPenalizacion
} from './order.controller.js';
import { validateMongoId } from '../../middlewares/validate-mongo-id.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireRole } from '../../middlewares/validate-role.js';

const router = Router();

router.post('/', validateJWT, addOrder);
router.get('/', validateJWT, listOrders);
router.put('/:id', validateJWT, requireRole('ADMIN_ROLE'), validateMongoId, editOrder);
router.delete('/:id', validateJWT, requireRole('ADMIN_ROLE'), validateMongoId, removeOrder);

router.get('/carrito', validateJWT, obtenerCarrito);
router.get('/pedidos/carrito', validateJWT, obtenerCarrito);

router.post('/carrito', validateJWT, agregarAlCarrito);
router.post('/pedidos/carrito', validateJWT, agregarAlCarrito);

router.post('/confirmar', validateJWT, confirmarPedido);
router.post('/pedidos/confirmar', validateJWT, confirmarPedido);

router.get('/historial', validateJWT, obtenerHistorial);
router.get('/pedidos/historial', validateJWT, obtenerHistorial);
router.get('/detalle/:id', validateJWT, validateMongoId, getOrderById);

router.get('/estado-penalizacion', validateJWT, obtenerEstadoPenalizacion);
router.get('/pedidos/estado-penalizacion', validateJWT, obtenerEstadoPenalizacion);

router.delete('/cancelar/:id', validateJWT, validateMongoId, cancelarPedido);
router.delete('/pedidos/cancelar/:id', validateJWT, validateMongoId, cancelarPedido);

router.post('/limpiar-expirados', limpiarPedidosExpirados);
router.post('/pedidos/limpiar-expirados', limpiarPedidosExpirados);

export default router;