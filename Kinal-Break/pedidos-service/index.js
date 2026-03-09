import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import pedidoRoutes from './routes/pedido.routes.js'; 

const app = express();

app.use(cors());
app.use(express.json()); 

// Rutas
app.use('/api/pedidos', pedidoRoutes);

const PORT = process.env.PORT || 3010; 
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/KinalBreak'; 

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('📦 Conectado a MongoDB (Servicio de Pedidos)');
        app.listen(PORT, () => {
            console.log(`🚀 Servicio de Pedidos corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error conectando a MongoDB:', error);
    });