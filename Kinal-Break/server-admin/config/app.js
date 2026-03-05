'use strict'

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { dbConnection } from './db.js';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler} from '../middleware/handle-errors';

const BASE_PATH = '/KinalBreak/v1';

const middlewares = (app) =>{
    app.use(express.urlencoded({extended: false, limit: '10mb'}));
    app.use(express.json({limit:'10mb'}));
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(helmet(helmetOptions));
    app.use(requestLimit);
}

const routes = (app) =>{
    // Poner las rutas


    app.get(`${BASE_PATH}/health`, (req, res)=>{
        res.status(200).json({
            status:'healthy',
            service: 'Kinal Break Server'
        })
    })
    app.use((req,res)=>{
        res.status(404).json({
            succes: false,
            message:'Ruta no esxixste en este servidor'
        })
    });
}

export const initServer = async ()=>{
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try{
        await dbConnection();
        middlewares(app);
        routes(app);
        app.use(errorHandler);

        app.listen(PORT, () =>{
            console.log(`Kinal Break server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
        });
    }catch(err){
        console.log(`Error al iniciar el servidor: ${err.message}`);
    }
}