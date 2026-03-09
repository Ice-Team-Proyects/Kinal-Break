import { body, param } from 'express-validator';
import { validateJWT } from '../validate-JWT.js';
import { checkValidators } from '../check-validators.js';

export const validateCreatePayment = [
    validateJWT,

    body('orderId')
        .notEmpty()
        .withMessage('Debe ingresar el ID de la orden'),

    body('amount')
        .notEmpty()
        .withMessage('Debe ingresar el monto del pago')
        .isFloat({ min: 0 })
        .withMessage('El monto debe ser un número mayor o igual a 0'),

    body('method')
        .notEmpty()
        .withMessage('Debe ingresar un método de pago')
        .isIn(['Efectivo', 'Tarjeta', 'Transferencia'])
        .withMessage('Método de pago no válido'),

    body('status')
        .optional()
        .isIn(['Pendiente', 'Completado', 'Cancelado'])
        .withMessage('Estado de pago no válido'),

    checkValidators
];

export const validatePaymentId = [
    validateJWT,

    param('id')
        .isMongoId()
        .withMessage('El ID del pago no es válido'),

    checkValidators
];

export const validateDeletePayment = [
    validateJWT,

    param('id')
        .isMongoId()
        .withMessage('El ID del pago no es válido'),

    checkValidators
];