import { cloudinary } from "../../middlewares/file-uploader.js";
import { broadcast } from "../events/sse.js";
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

        broadcast('accompaniments', { action: 'created', accompaniment: acc });
        res.json(acc);

    }catch(error){
        res.status(500).json({ success: false, msg: error.message });
    }

};


export const getAccompaniments = async (req,res)=>{

    try{

        const acc = await fetchAccompaniments();

        res.json(acc);

    }catch(error){
        res.status(500).json({ success: false, msg: error.message });
    }

};


export const updateAccompaniment = async (req,res)=>{

    try{

        const acc = await updateAccompanimentService(
            req.params.id,
            req.body
        );

        broadcast('accompaniments', { action: 'updated', accompaniment: acc });
        res.json(acc);

    }catch(error){
        res.status(500).json({ success: false, msg: error.message });
    }

};


export const deleteAccompaniment = async (req,res)=>{

    try{

        const acc = await deleteAccompanimentService(
            req.params.id
        );

        broadcast('accompaniments', { action: 'deleted', id: req.params.id });
        res.json(acc);

    }catch(error){
        res.status(500).json({ success: false, msg: error.message });
    }

};


export const restoreAccompaniment = async (req,res)=>{

    try{

        const acc = await restoreAccompanimentService(
            req.params.id
        );

        broadcast('accompaniments', { action: 'restored', accompaniment: acc });
        res.json(acc);

    }catch(error){
        res.status(500).json({ success: false, msg: error.message });
    }

};