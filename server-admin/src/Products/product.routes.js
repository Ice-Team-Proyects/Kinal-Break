import { Router } from "express";

import { uploadProductImage } from "../../middlewares/file-uploader.js";
import { cleanupUploadedFileOnFinish } from '../../middlewares/delete-file-on-error.js'
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireRole } from '../../middlewares/validate-role.js';

import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    restoreProduct
} from "../Products/product.controller.js";

import {
    createProductValidator,
    updateProductValidator,
    productIdValidator,
    queryProductValidator
} from "../../middlewares/product-validator.js";

const router = Router();

const uploadPhotoOrImage = (req, res, next) => {
    const uploadPhoto = uploadProductImage.single('photo');
    uploadPhoto(req, res, err => {
        if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
            // field not 'photo', try 'image'
            const uploadImage = uploadProductImage.single('image');
            uploadImage(req, res, next);
        } else {
            next(err);
        }
    });
};

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto (solo ADMIN_ROLE)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 */
router.post(
    "/",
    validateJWT,
    requireRole("ADMIN_ROLE"),
    uploadPhotoOrImage,
    cleanupUploadedFileOnFinish,
    createProductValidator,
    createProduct
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos los productos
 *     tags: [Productos]
 */
router.get(
    "/",
    queryProductValidator,
    getProducts
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualiza un producto (solo ADMIN_ROLE)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 */
router.put(
    "/:id",
    validateJWT,
    requireRole("ADMIN_ROLE"),
    uploadPhotoOrImage,
    cleanupUploadedFileOnFinish,
    updateProductValidator,
    updateProduct
);

/**
 * @swagger
 * /products/delete/{id}:
 *   patch:
 *     summary: Elimina un producto lógicamente (solo ADMIN_ROLE)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    "/delete/:id",
    validateJWT,
    requireRole("ADMIN_ROLE"),
    productIdValidator,
    deleteProduct
);

/**
 * @swagger
 * /products/restore/{id}:
 *   patch:
 *     summary: Restaura un producto eliminado (solo ADMIN_ROLE)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
    "/restore/:id",
    validateJWT,
    requireRole("ADMIN_ROLE"),
    productIdValidator,
    restoreProduct
);

export default router;