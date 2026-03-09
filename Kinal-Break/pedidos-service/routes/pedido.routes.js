import { Router } from 'express';
import { 
    agregarAlCarrito, 
    confirmarPedido, 
    obtenerHistorial, 
    cancelarPedido 
} from '../controllers/pedido.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';

const router = Router();

router.post('/carrito', [validateJWT], agregarAlCarrito);
router.post('/confirmar', [validateJWT], confirmarPedido);
router.get('/historial', [validateJWT], obtenerHistorial);
router.delete('/cancelar/:id', [validateJWT], cancelarPedido);

export default router;