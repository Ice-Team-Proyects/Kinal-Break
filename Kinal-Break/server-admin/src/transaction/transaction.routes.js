import { Router } from 'express';
import { 
    registrarPago, 
    listarTransacciones, 
    obtenerTransaccionUnica 
} from './transaction.controller.js';

import { validarJWT } from '../../middlewares/validate-JWT.js';
import { validarTransaccion } from '../../middlewares/transaction.validator.js';

const router = Router();

// Endpoint para crear una transacción (Ej. al momento de pagar en caja)
router.post('/', [validarJWT, validarTransaccion], registrarPago);
router.post('/', registrarPago);

// Endpoint para listar todas las transacciones (ideal para los reportes)
router.get('/', [validarJWT], listarTransacciones);
router.get('/', listarTransacciones);

// Endpoint para ver el detalle de un pago específico
router.get('/:id', [validarJWT], obtenerTransaccionUnica);
router.get('/:id', obtenerTransaccionUnica);

export default router;