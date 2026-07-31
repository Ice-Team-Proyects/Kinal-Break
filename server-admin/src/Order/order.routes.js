import { Router } from 'express';
import { 
    addOrder, 
    listOrders, 
    editOrder, 
    removeOrder,
    obtenerCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    confirmarPedido,
    obtenerHistorial,
    cancelarPedido,
    limpiarPedidosExpirados,
    limpiarPenalizacionUsuario
} from './order.controller.js';
import { validateMongoId } from '../../middlewares/validate-mongo-id.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireRole } from '../../middlewares/validate-role.js';
import { checkPenalty } from '../../middlewares/check-penalty.js';
import { uploadPaymentProof } from '../../middlewares/file-uploader.js';

const router = Router();

const uploadComprobante = (req, res, next) => {
    const upload = uploadPaymentProof.single('comprobante');
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                msg: err.message || 'Error al subir el comprobante',
            });
        }
        next();
    });
};

router.post('/', validateJWT, checkPenalty, addOrder);
router.get('/', validateJWT, listOrders);
router.put('/:id', validateJWT, requireRole('ADMIN_ROLE'), validateMongoId, editOrder);
router.delete('/:id', validateJWT, requireRole('ADMIN_ROLE'), validateMongoId, removeOrder);

router.get('/carrito', validateJWT, obtenerCarrito);
router.get('/pedidos/carrito', validateJWT, obtenerCarrito);

router.post('/carrito', validateJWT, checkPenalty, agregarAlCarrito);
router.post('/pedidos/carrito', validateJWT, checkPenalty, agregarAlCarrito);

router.delete('/carrito/:itemId', validateJWT, eliminarDelCarrito);
router.delete('/pedidos/carrito/:itemId', validateJWT, eliminarDelCarrito);

router.post('/confirmar', validateJWT, checkPenalty, uploadComprobante, confirmarPedido);
router.post('/pedidos/confirmar', validateJWT, checkPenalty, uploadComprobante, confirmarPedido);

router.get('/historial', validateJWT, obtenerHistorial);
router.get('/pedidos/historial', validateJWT, obtenerHistorial);

router.delete('/cancelar/:id', validateJWT, validateMongoId, cancelarPedido);
router.delete('/pedidos/cancelar/:id', validateJWT, validateMongoId, cancelarPedido);

router.post(
    '/penalizacion/:usuarioId/limpiar',
    validateJWT,
    requireRole('ADMIN_ROLE'),
    limpiarPenalizacionUsuario
);

router.post('/limpiar-expirados', limpiarPedidosExpirados);
router.post('/pedidos/limpiar-expirados', limpiarPedidosExpirados);

export default router;
