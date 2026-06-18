import { body, param, validationResult } from "express-validator";

const validateFields = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};


// crear acompañamiento
export const createAccompanimentValidator = [

    body("name")
        .notEmpty()
        .withMessage("El nombre del acompañamiento es obligatorio"),

    body("price")
        .optional()
        .isNumeric()
        .withMessage("El precio debe ser numérico"),

    validateFields
];


// actualizar acompañamiento
export const updateAccompanimentValidator = [

    param("id")
        .isMongoId()
        .withMessage("ID inválido"),

    body("name")
        .optional()
        .notEmpty()
        .withMessage("El nombre no puede estar vacío"),

    body("price")
        .optional()
        .isNumeric()
        .withMessage("El precio debe ser numérico"),

    validateFields
];


// validar ID
export const accompanimentIdValidator = [

    param("id")
        .isMongoId()
        .withMessage("ID inválido"),

    validateFields
];