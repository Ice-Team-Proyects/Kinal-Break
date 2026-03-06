import express from "express";

import { uploadAcompanimentImage } from "../../middlewares/file-uploader.js";
import { deleteFileOnError, cleanupUploadedFileOnFinish } from "../../middlewares/delete-file-on-error.js";
import {
createAccompaniment,
getAccompaniments,
updateAccompaniment,
deleteAccompaniment,
restoreAccompaniment
} from "../Accompaniment/accompaniment.controller.js";

import {
createAccompanimentValidator,
updateAccompanimentValidator,
accompanimentIdValidator
} from "../../middlewares/accompaniment-validator.js";

import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = express.Router();

const uploadPhotoOrImage = (req, res, next) => {
    const uploadPhoto = uploadAcompanimentImage.single('photo');
    uploadPhoto(req, res, err => {
        if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
            const uploadImage = uploadAcompanimentImage.single('image');
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
createAccompanimentValidator,
createAccompaniment
);

router.get(
"/",
getAccompaniments
);

router.put(
"/:id",
validateJWT,
uploadPhotoOrImage,
deleteFileOnError,
updateAccompanimentValidator,
updateAccompaniment
);


router.patch(
"/delete/:id",
validateJWT,
accompanimentIdValidator,
deleteAccompaniment
);

router.patch(
"/restore/:id",
validateJWT,
accompanimentIdValidator,
restoreAccompaniment
);

export default router;