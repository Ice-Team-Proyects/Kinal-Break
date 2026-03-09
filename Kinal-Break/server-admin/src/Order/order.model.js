import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
    {
        numeroPedido: {
            type: String,
            required: true,
            unique: true
        },
        usuarioId: {
            type: String, 
            required: true
        },
        estado: {
            type: String,
            enum: ['Pendiente', 'Pagado', 'Entregado', 'No pagado'],
            default: 'Pendiente'
        },
        totalCobrar: {
            type: Number,
            required: true
        },
        activo: {
            type: Boolean,
            default: true // Usado para el Soft Delete
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Order', orderSchema);