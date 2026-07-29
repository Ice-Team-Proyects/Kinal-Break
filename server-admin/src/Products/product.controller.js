import { cloudinary } from "../../middlewares/file-uploader.js";
import Product from "../Products/product.model.js";
import {
    createProductRecord as createProductService,
    fetchProducts,
    deleteProduct as deleteProductService,
    restoreProduct as restoreProductService
} from "../Products/product.service.js";
import { broadcast } from "../events/sse.js";

const normalizeProductBody = (body) => {
    const data = { ...body };

    // Multer/FormData often sends accompaniments[] instead of accompaniments
    const rawAcc = data.accompaniments ?? data['accompaniments[]'];
    if (rawAcc !== undefined) {
        data.accompaniments = Array.isArray(rawAcc) ? rawAcc : [rawAcc];
    }
    delete data['accompaniments[]'];

    if (data.allowAccompaniments !== undefined) {
        data.allowAccompaniments =
            data.allowAccompaniments === true ||
            data.allowAccompaniments === 'true' ||
            data.allowAccompaniments === 'on';
    }

    if (data.price !== undefined) {
        data.price = Number(data.price);
    }

    return data;
};

export const createProduct = async (req,res)=>{
    try{

        let photoUrl = "";

        if (req.file) {
            photoUrl = req.file.path || req.file.secure_url || req.file.url || "";
        }

        const product = await createProductService({
            ...normalizeProductBody(req.body),
            photo: photoUrl || req.body.photo || ""
        });

        broadcast('products', { action: 'created', product });
        res.json(product);

    }catch(error){
        res.status(500).json({error:error.message});
    }
};

export const getProducts = async(req,res)=>{
    try{

        const products = await fetchProducts(req.query);

        res.json(products);

    }catch(error){
        res.status(500).json({ success: false, msg: error.message });
    }
}

export const updateProduct = async(req,res)=>{

    try{
        const updateData = normalizeProductBody(req.body);

        if (req.file) {
            // si llegó un archivo nuevo, obtenemos la URL del objeto multer
            updateData.photo =
                req.file.path || req.file.secure_url || req.file.url || updateData.photo;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new:true }
        );

        broadcast('products', { action: 'updated', product });
        res.json(product);

    }catch(error){
        res.status(500).json({ success: false, msg: error.message });
    }

};

export const deleteProduct = async(req,res)=>{

    try{

        const product = await deleteProductService(
            req.params.id
        );

        broadcast('products', { action: 'deleted', id: req.params.id });
        res.json(product);

    }catch(error){
        res.status(500).json({ success: false, msg: error.message });
    }

};


export const restoreProduct = async(req,res)=>{

    try{

        const product = await restoreProductService(
            req.params.id
        );

        broadcast('products', { action: 'restored', product });
        res.json(product);

    }catch(error){
        res.status(500).json({ success: false, msg: error.message });
    }
};