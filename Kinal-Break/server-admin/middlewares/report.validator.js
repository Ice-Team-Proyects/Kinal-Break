import { query } from 'express-validator';
import { validateJWT } from '../validate-JWT.js';
import { checkValidators } from '../check-validators.js';

export const validateSalesReport = [
    validateJWT,

    query('startDate')
        .notEmpty()
        .withMessage('Debe ingresar la fecha inicial')
        .isISO8601()
        .withMessage('Formato de fecha inválido'),

    query('endDate')
        .notEmpty()
        .withMessage('Debe ingresar la fecha final')
        .isISO8601()
        .withMessage('Formato de fecha inválido'),

    checkValidators
];