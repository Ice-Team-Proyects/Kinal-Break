import { Router } from 'express';
// Fíjate cómo ahora importamos las 4 funciones del controlador
import { 
    agregarAlCarrito, 
    confirmarPedido, 
    obtenerHistorial, 
    cancelarPedido 
} from '../controllers/pedido.controller.js';
import { validateJWT } from '../middlewares/validate-JWT.js';

const router = Router();

// Middleware de seguridad: Todas estas rutas requerirán un token válido
router.use(validateJWT); 

// Rutas que ya tenías
router.post('/carrito', agregarAlCarrito);
router.post('/confirmar', confirmarPedido);

// --- LAS DOS RUTAS NUEVAS QUE DEBES AGREGAR ---
router.get('/historial', obtenerHistorial);
router.put('/cancelar/:numeroPedido', cancelarPedido); // Usamos :numeroPedido como parámetro en la URL

export default router;