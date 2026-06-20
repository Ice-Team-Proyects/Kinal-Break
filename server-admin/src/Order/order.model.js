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
        productos: [
            {
                productoId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                cantidad: {
                    type: Number,
                    required: true
                },
                precioUnitario: {
                    type: Number,
                    required: true
                },
                acompanamientoId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    default: null
                }
            }
        ],
        estado: {
            type: String,
            enum: ['Pendiente', 'Pagado', 'Entregado', 'No pagado', 'Cancelado'],
            default: 'Pendiente'
        },
        totalCobrar: {
            type: Number,
            default: 0
        },
        // Alias used by pedidos-service
        totalFinal: {
            type: Number,
            default: 0
        },
        activo: {
            type: Boolean,
            default: true // Usado para el Soft Delete
        }
    },
    {
        timestamps: true,
        versionKey: false,
        // Share the same 'pedidos' collection with pedidos-service
        collection: 'pedidos'
    }
);

export default model('Order', orderSchema);