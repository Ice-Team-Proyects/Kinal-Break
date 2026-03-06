import { cloudinary } from "../../middlewares/file-uploader.js";
import {
    createAccompaniment as createAccompanimentService,
    fetchAccompaniments,
    updateAccompaniment as updateAccompanimentService,
    deleteAccompaniment as deleteAccompanimentService,
    restoreAccompaniment as restoreAccompanimentService
} from "../Accompaniment/accompaniment.service.js";


export const createAccompaniment = async (req,res)=>{

    try{

        let photoUrl = "";
        if (req.file) {
            photoUrl = req.file.path || req.file.secure_url || req.file.url || "";
        }

        const acc = await createAccompanimentService({
            ...req.body,
            photo: photoUrl
        });

        res.json(acc);

    }catch(error){
        res.status(500).json(error);
    }

};


export const getAccompaniments = async (req,res)=>{

    try{

        const acc = await fetchAccompaniments();

        res.json(acc);

    }catch(error){
        res.status(500).json(error);
    }

};


export const updateAccompaniment = async (req,res)=>{

    try{

        const acc = await updateAccompanimentService(
            req.params.id,
            req.body
        );

        res.json(acc);

    }catch(error){
        res.status(500).json(error);
    }

};


export const deleteAccompaniment = async (req,res)=>{

    try{

        const acc = await deleteAccompanimentService(
            req.params.id
        );

        res.json(acc);

    }catch(error){
        res.status(500).json(error);
    }

};


export const restoreAccompaniment = async (req,res)=>{

    try{

        const acc = await restoreAccompanimentService(
            req.params.id
        );

        res.json(acc);

    }catch(error){
        res.status(500).json(error);
    }

};