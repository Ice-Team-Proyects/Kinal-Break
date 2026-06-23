import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validator.js';

export const validateCreatePayment = [
    validateJWT,

    body('orderId')
        .notEmpty()
        .withMessage('Debe ingresar el ID de la orden'),

    body('userId')
        .notEmpty()
        .withMessage('Debe ingresar el ID del usuario'),

    body('amount')
        .notEmpty()
        .withMessage('Debe ingresar el monto del pago')
        .isFloat({ min: 0 })
        .withMessage('El monto debe ser un número mayor o igual a 0'),

    body('paymentMethod')
        .notEmpty()
        .withMessage('Debe ingresar un método de pago')
        .isIn(['Efectivo', 'Transferencia'])
        .withMessage('Método de pago no válido'),

    body('status')
        .optional()
        .isIn(['Pagado', 'Pendiente', 'No Pagado'])
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