import { body, param, query, validationResult } from "express-validator";

const validateFields = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};


// validar creación de producto
export const createProductValidator = [

    body("name")
        .notEmpty()
        .withMessage("El nombre es obligatorio"),

    body("price")
        .notEmpty()
        .withMessage("El precio es obligatorio")
        .isNumeric()
        .withMessage("El precio debe ser numérico"),

    body("category")
        .notEmpty()
        .withMessage("La categoría es obligatoria")
        .isIn([
            "desayunos",
            "almuerzos",
            "bebidas",
            "snacks"
        ])
        .withMessage("Categoría no válida"),

    validateFields
];


// validar actualización
export const updateProductValidator = [

    param("id")
        .isMongoId()
        .withMessage("ID no válido"),

    body("price")
        .optional()
        .isNumeric()
        .withMessage("El precio debe ser numérico"),

    body("category")
        .optional()
        .isIn([
            "desayunos",
            "almuerzos",
            "bebidas",
            "snacks"
        ])
        .withMessage("Categoría no válida"),

    validateFields
];


// validar eliminación
export const productIdValidator = [

    param("id")
        .isMongoId()
        .withMessage("ID inválido"),

    validateFields
];


// validar búsqueda
export const queryProductValidator = [

    query("category")
        .optional()
        .isIn([
            "desayunos",
            "almuerzos",
            "bebidas",
            "snacks"
        ])
        .withMessage("Categoría inválida"),

    validateFields
];