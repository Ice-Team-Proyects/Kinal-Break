import { body, param } from 'express-validator';
import { validateJWT } from '../validate-JWT.js';
import { checkValidators } from '../check-validators.js';

export const validateCreateTransaction = [
    validateJWT,

    body('paymentId')
        .notEmpty()
        .withMessage('Debe ingresar el ID del pago'),

    body('total')
        .notEmpty()
        .withMessage('Debe ingresar el total de la transacción')
        .isFloat({ min: 0 })
        .withMessage('El total debe ser mayor o igual a 0'),

    body('status')
        .notEmpty()
        .withMessage('Debe ingresar el estado')
        .isIn(['Pendiente', 'Completado', 'Cancelado'])
        .withMessage('Estado de transacción no válido'),

    checkValidators
];

export const validateTransactionId = [
    validateJWT,

    param('id')
        .isMongoId()
        .withMessage('El ID de la transacción no es válido'),

    checkValidators
];