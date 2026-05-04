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
 *     summary: Crea un nuevo producto
 *     description: Sube un nuevo producto al catálogo incluyendo su imagen (photo o image).
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *               category:
 *                 type: string
 *                 description: Categoría a la que pertenece
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *       400:
 *         description: Error de validación o formato de imagen.
 *       401:
 *         description: No autorizado.
 */
router.post(
    "/",
    validateJWT,
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
 *     description: Obtiene el catálogo de productos activos.
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
    "/",
    queryProductValidator, // CORREGIDO: El validador va ANTES del controlador
    getProducts
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualiza un producto
 *     description: Modifica los datos de un producto existente y permite actualizar su imagen.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de Mongo del producto
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *       400:
 *         description: ID inválido o error en los datos.
 *       404:
 *         description: Producto no encontrado.
 */
router.put(
    "/:id",
    validateJWT,
    uploadPhotoOrImage,
    cleanupUploadedFileOnFinish,
    updateProductValidator,
    updateProduct
);

/**
 * @swagger
 * /products/delete/{id}:
 *   patch:
 *     summary: Elimina un producto lógicamente
 *     description: Desactiva un producto del catálogo sin borrarlo físicamente de la base de datos.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de Mongo del producto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado (desactivado) exitosamente.
 *       400:
 *         description: ID inválido.
 */
router.patch(
    "/delete/:id",
    validateJWT,
    productIdValidator, // CORREGIDO: El validador va ANTES del controlador
    deleteProduct
);

/**
 * @swagger
 * /products/restore/{id}:
 *   patch:
 *     summary: Restaura un producto eliminado
 *     description: Vuelve a activar un producto que había sido eliminado lógicamente.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de Mongo del producto a restaurar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto restaurado exitosamente.
 *       400:
 *         description: ID inválido.
 */
router.patch(
    "/restore/:id",
    validateJWT,
    productIdValidator, // CORREGIDO: El validador va ANTES del controlador
    restoreProduct
);

export default router;