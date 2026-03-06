import { cloudinary } from "../../middlewares/file-uploader.js";
import Product from "../Products/product.model.js";
import {
    createProductRecord as createProductService,
    fetchProducts,
    deleteProduct as deleteProductService,
    restoreProduct as restoreProductService
} from "../Products/product.service.js";

export const createProduct = async (req,res)=>{
    try{

        let photoUrl = "";

        if (req.file) {
            photoUrl = req.file.path || req.file.secure_url || req.file.url || "";
        }

        const product = await createProductService({
            ...req.body,
            photo: photoUrl
        });

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
        res.status(500).json(error);
    }
}

export const updateProduct = async(req,res)=>{

    try{
        const updateData = { ...req.body };

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

        res.json(product);

    }catch(error){
        res.status(500).json(error);
    }

};

export const deleteProduct = async(req,res)=>{

    try{

        const product = await deleteProductService(
            req.params.id
        );

        res.json(product);

    }catch(error){
        res.status(500).json(error);
    }

};


export const restoreProduct = async(req,res)=>{

    try{

        const product = await restoreProductService(
            req.params.id
        );

        res.json(product);

    }catch(error){
        res.status(500).json(error);
    }
};