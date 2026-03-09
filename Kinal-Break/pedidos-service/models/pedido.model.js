import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const carritoSchema = new mongoose.Schema({
    usuarioId: { 
        type: String, // Es String porque el ID de .NET es un string
        required: true,
        unique: true
    },
    productos: [{
        productoId: { 
            type: mongoose.Schema.Types.ObjectId, // ID de MongoDB del producto de Emilio
            ref: "Product",
            required: true 
        },
        cantidad: { type: Number, required: true, min: 1 },
        precioUnitario: { type: Number, required: true }
    }],
    totalTemporal: { type: Number, default: 0 }
}, { timestamps: true });

const pedidoSchema = new mongoose.Schema({
    numeroPedido: { type: String, default: uuidv4, unique: true },
    usuarioId: { type: String, required: true },
    productos: [{
        productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        cantidad: { type: Number, required: true },
        precioUnitario: { type: Number, required: true }
    }],
    totalFinal: { type: Number, required: true },
    estado: { 
        type: String, 
        enum: ['Pendiente', 'Pagado', 'Entregado', 'No pagado', 'Cancelado'], 
        default: 'Pendiente' 
    }
}, { timestamps: true });

export const Carrito = mongoose.model("Carrito", carritoSchema);
export const Pedido = mongoose.model("Pedido", pedidoSchema);