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

router.post(
"/",
validateJWT,
uploadPhotoOrImage,
cleanupUploadedFileOnFinish,
createProductValidator,
createProduct
);

router.get(
"/",
getProducts,
queryProductValidator
);

router.put(
"/:id",
validateJWT,
uploadPhotoOrImage,
cleanupUploadedFileOnFinish,
updateProductValidator,
updateProduct
);

router.patch(
"/delete/:id",
validateJWT,
deleteProduct,
productIdValidator
);

router.patch(
"/restore/:id",
validateJWT,
restoreProduct,
productIdValidator
);

export default router;